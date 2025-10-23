import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import type { H3Event } from 'h3'
import { colorSchema, settingsFormSchema, type SettingsForm } from '~~/types/db'
import z from 'zod'
import sanitizeHtml from 'sanitize-html'

export function makeUsername(name: string): string {
  // TODO: check for uniqueness in the database
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9äöüß]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .substring(0, 30)
}

export async function createUser({
  name,
  userName,
  settings,
}: {
  name: string
  userName: string
  settings: SettingsForm
}) {
  const db = await getDatabaseConnection()

  settings.public.company.lastMod = new Date().toISOString()
  settings.public.pages = settings.public.pages.map(page => ({
    ...page,
    lastMod: new Date().toISOString(),
  }))

  const insertResult = await db
    .insertInto('users')
    .values({
      name,
      userName: makeUsername(userName),
      published: false,
      domain: null,
      domainIsExternal: false,
      settings: 0,
      mailboxes: '',
    })
    .executeTakeFirstOrThrow()

  if (!insertResult.insertId) {
    throw new Error('Failed to insert user')
  }

  const newUserId = Number(insertResult.insertId.toString())

  const newUser = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', newUserId)
    .executeTakeFirstOrThrow()

  const historyInsert = await db
    .insertInto('settingsHistory')
    .values({ userId: newUser.id, settings: JSON.stringify(settings) })
    .executeTakeFirstOrThrow()

  if (!historyInsert.insertId) {
    throw new Error('Failed to insert initial settings history')
  }

  const settingsVersionId = Number(historyInsert.insertId.toString())

  await db
    .updateTable('users')
    .set({ settings: settingsVersionId })
    .where('id', '=', newUser.id)
    .execute()

  await chatwoot.createContact(newUser.id, newUser.userName)

  return newUser
}

// TODO: Should be checked on database level
export function checkLastPayment(lastPaidAt: Date | string | null): boolean {
  if (!lastPaidAt) {
    return false
  }
  const lastPaidDate = new Date(lastPaidAt)
  return lastPaidDate > new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
}

export async function getMe(event: H3Event) {
  const { user } = await getUserSession(event)
  const db = await getDatabaseConnection()

  if (!user) {
    return null
  }

  const userInDb = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', user.id)
    .executeTakeFirst()

  if (!userInDb) {
    return null
  }

  return userInDb
}

export async function requireMe(event: H3Event) {
  const user = await getMe(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'You must be logged in to access this resource.',
    })
  }

  return user
}

export async function requireAdmin(event: H3Event) {
  const user = await requireMe(event)

  if (user.id !== 1) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You do not have permission to access this resource.',
    })
  }

  return user
}

export function requireProfile(event: H3Event) {
  if (!event.context.profile) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'No profile in context',
    })
  }
  
  return event.context.profile
}

export async function requireProfileWithPermission(event: H3Event) {
  const { user } = await requireUserSession(event)
  const profile = requireProfile(event)

  if (user && (user.id === profile.id || profile.isAdmin)) {
    return profile
  }

  throw createError({
    statusCode: 403,
    statusMessage: 'Forbidden',
    message: 'You do not have permission to access this profile',
  })
}

export function getValidatedSettings(settings: string | Record<string, unknown>): SettingsForm {
  const validatedSettings = settingsFormSchema.parse(getUnvalidatedSettings(settings))

  return validatedSettings
}

export function getUnvalidatedSettings(settings: string | Record<string, unknown>): SettingsForm {
  const parsedSettings = typeof settings === 'string' ? JSON.parse(settings) : settings

  return parsedSettings as SettingsForm
}

export async function getSettings(userIdOrName: number | string) {
  const db = await getDatabaseConnection()

  let settings: SettingsForm | null = null

  if (typeof userIdOrName === 'number') {
    const user = await db
      .selectFrom('users')
      .select('settings')
      .where('id', '=', userIdOrName)
      .executeTakeFirstOrThrow()

    const history = await db
      .selectFrom('settingsHistory')
      .select('settings')
      .where('id', '=', user.settings)
      .executeTakeFirstOrThrow()
    settings = getValidatedSettings(history.settings)
  }
  else {
    const user = await db
      .selectFrom('users')
      .select('settings')
      .where('userName', '=', userIdOrName)
      .executeTakeFirstOrThrow()

    const history = await db
      .selectFrom('settingsHistory')
      .select('settings')
      .where('id', '=', user.settings)
      .executeTakeFirstOrThrow()
    settings = getValidatedSettings(history.settings)
  }

  return settings
}

export async function getPublicSettings(userNameOrId: number | string) {
  const settings = await getSettings(userNameOrId)

  return settings.public
}

export async function getPrivateSettings(userNameOrId: number | string) {
  const settings = await getSettings(userNameOrId)

  return settings.private
}

export async function prefillSettings(settings: SettingsForm): Promise<SettingsForm> {
  const { openaiApiKey } = useRuntimeConfig()
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  const prefillSchema = z.object({
    title: z.string(),
    tagline: z.string(),
    primary_color: colorSchema,
    title_text_color: colorSchema,
    tagline_text_color: colorSchema,
    header_background_color: colorSchema,
    offerings: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
  })

  const response = await openai.responses.parse({
    model: 'gpt-5',
    instructions: `Deine Aufgabe ist es, **passende Design-Einstellungen und Inhalte** für eine einfache Website vorzuschlagen.
Du erhältst dazu nur ein ausgefülltes Registrierungsformular mit den wichtigsten Informationen über das Unternehmen.
Die Beschreibung des Unternehmens kann dabei unterschiedlich ausführlich sein - von der reinen Branche bis hin zu einer detaillierten Beschreibung der angebotenen Leistungen. Das obliegt dem Nutzer.
Ziel ist es in jedem Fall ein stimmiges Design und passende Texte zu generieren, die der Nutzer dann bei Bedarf noch anpassen kann.

Die initiale Website besteht aus einem Header (fullscreen), einer einfachen Angebotsübersicht und einem FAQ-Bereich.

Gehe wie folgt vor:

1. Überlege dir eine passende Kombination aus Titel und Slogan für den Header.
- Der Titel kann der Name des Unternehmens sein oder eine kurze, prägnante Überschrift der angebotenen Leistungen / des Produkts.
- Der Slogan muss ein kurzer, professioneller Spruch unter diesem Titel sein.
  - Er darf keine Produktdetails, Preise, Aktionen oder spezifische Angebote enthalten.
  - Er soll die Mission und Werte des Unternehmens prägnant widerspiegeln.

2. Bestimme ein passendes Farbschema für die Website.
- Wähle eine Primärfarbe, die zur Art des Unternehmens passt.
- Bestimme eine Hintergrundfarbe für den Header, die gut mit der Primärfarbe harmoniert.
- Wähle passend dazu Textfarben für den Titel und den Slogan im Header.
- Achte auf ausreichend Kontrast und Lesbarkeit.
- Verwende für alle Farben die HSL-Notation.

3. Formuliere bis zu drei prägnante Marketingtexte für die Angebotsübersicht.
- Konzentriere dich auf die wichtigsten Vorteile der Angebote.
- Falls keine weiteren Details über das Unternehmen angegeben sind, schreibe mindestens einen allgemeinen Marketingtext, der zu einem kleinen Unternehmen in der genannten Branche passt.
- Du darfst einfache HTML-Markup-Tags ohne Attribute verwenden. Erlaubt sind <p>, <strong>, <em>, <u>, <mark>, <ul>, <ol> und <li>.
- Die Überschriften der Texte sollten so kurz und prägnant wie möglich sein.
- Jeder Text sollte maximal 100 Wörter umfassen.

4. Formuliere bis zu drei häufig gestellte Fragen (FAQ) mit Antworten.
- Die Fragen sollten allgemeiner Natur sein und sich auf die Branche beziehen.
- Falls keine weiteren Details über das Unternehmen angegeben sind, formuliere mindestens eine allgemeine Frage, die zu einem kleinen Unternehmen in der genannten Branche passt.
- Jede Antwort sollte maximal 50 Wörter umfassen.
`,
    input: [
      {
        role: 'user',
        content: `Firmenname: ${settings.public.company.name}
Kleinunternehmen: ${settings.public.company.isSmallBusiness ? 'Ja' : 'Nein'}
Stadt: ${settings.public.company.city}
Über: ${settings.private.assistant.context}`,
      },
    ],
    text: {
      format: zodTextFormat(prefillSchema, 'website_settings'),
    },
  })

  const prefill = response.output_parsed

  if (prefill) {
    const titleFontSize = 16
    const descriptionFontSize = 8

    settings.public.design.color = prefill.primary_color
    settings.public.pages[0].components = [
      {
        id: new Date().getTime() + 1,
        key: 'html',
        title: prefill.title,
        description: prefill.tagline,
        visible: true,
        order: 1,
        html: `<h1>${sanitizeHtml(prefill.title)}</h1>
<p>${sanitizeHtml(prefill.tagline)}</p>
        `,
        css: `
          h1 {
            color: hsl(${prefill.title_text_color.h}, ${prefill.title_text_color.s}%, ${prefill.title_text_color.l}%);
            font-size: ${titleFontSize}pt;
          }
          p {
            color: hsl(${prefill.tagline_text_color.h}, ${prefill.tagline_text_color.s}%, ${prefill.tagline_text_color.l}%);
            font-size: ${descriptionFontSize}pt;
          }
          .header {
            background-color: hsl(${prefill.header_background_color.h}, ${prefill.header_background_color.s}%, ${prefill.header_background_color.l}%);
          }
        `,
        js: '',
      },
    ]
  }

  return settings
}
