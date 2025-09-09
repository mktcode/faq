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

  const insertResult = await db
    .insertInto('users')
    .values({
      name,
      userName: makeUsername(userName),
      published: false,
      domain: null,
      domainIsExternal: false,
      settings: JSON.stringify(settings),
      mailboxes: JSON.stringify([]),
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

  const customerRequestInsertResult = await db
    .insertInto('customerRequests')
    .values({
      userId: newUserId,
      uuid: crypto.randomUUID(),
      name: 'Solohost',
      email: 'support@solohost.de',
      phone: '0176 70 86 46 27',
      status: 'pending',
    })
    .executeTakeFirstOrThrow()

  if (!customerRequestInsertResult.insertId) {
    throw new Error('Failed to insert customer request')
  }

  const newCustomerRequestId = Number(customerRequestInsertResult.insertId.toString())

  await db
    .insertInto('messages')
    .values({
      customerRequestId: newCustomerRequestId,
      body: 'Willkommen bei Solohost! Wir freuen uns, dass Sie sich für unsere Plattform entschieden haben. Bei Fragen oder Anliegen können Sie uns jederzeit kontaktieren.',
      isCustomer: true,
    })
    .execute()

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

export function getValidatedSettings(settings: string | Record<string, unknown>): SettingsForm {
  const validatedSettings = settingsFormSchema.parse(typeof settings === 'string' ? JSON.parse(settings) : settings)

  // sanitize html content
  // TODO: make this more comprehensive and maybe move to saving instead of serving
  validatedSettings.public.pages = validatedSettings.public.pages.map(page => ({
    ...page,
    components: page.components.map(component => {
      if (component.key === 'offerings') {
        component.items = component.items.map(offer => ({
          ...offer,
          description: sanitizeHtml(offer.description),
        }))
      }
      return component
    }),
  }))

  return validatedSettings
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

    settings = getValidatedSettings(user.settings)
  }
  else {
    const user = await db
      .selectFrom('users')
      .select('settings')
      .where('userName', '=', userIdOrName)
      .executeTakeFirstOrThrow()

    settings = getValidatedSettings(user.settings)
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
    primary_color: colorSchema,
    title: z.string(),
    title_text_color: colorSchema,
    tagline: z.string(),
    tagline_text_color: colorSchema,
    header_background_color: colorSchema,
    offerings: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })),
  })

  const response = await openai.responses.parse({
    model: 'gpt-5-mini',
    instructions: `You’ll receive only minimal information about the company.
Your task is to **guess suitable design preferences and content** from the limited company information and propose:
1. A modern website header configuration.
2. A coherent color scheme defined in the given output structure.
3. A suitable tagline for the company.
4. Up to three marketing texts for the company's offerings on their website.

* Use HSL notation for all colors.
* Define a coherent color scheme with the background image in mind.
* The tagline must be a short, professional slogan under the company name.
  - It must not include product details, prices, promotions, or specific offers.
  - Instead, it must reflect the company’s mission and values concisely.
  - The text color must have good contrast with the background image and overlay.
* The marketing texts must be concise (no more than 100 words each) and focus on the key benefits of the offerings.
  - If no information is provided, write at least one generic marketing text suitable for a small business in the given industry.
  - You may use simple HTML markup without any attributes. Allowed tags are <p>, <strong>, <em>, <u>, <mark>, <ul>, <ol>, and <li>.
* All written text must be in German.`,
    input: [
      {
        role: 'user',
        content: `Company Name: ${settings.public.company.name}
Small Business: ${settings.public.company.isSmallBusiness ? 'Yes' : 'No'}
City: ${settings.public.company.city}
About: ${settings.private.assistant.context}`,
      },
    ],
    text: {
      format: zodTextFormat(prefillSchema, 'website_settings'),
    },
  })

  const prefill = response.output_parsed

  if (prefill) {
    settings.public.design.color = prefill.primary_color
    settings.public.pages[0].components.push(
      {
        id: new Date().getTime() + 1,
        key: 'header',
        title: prefill.title,
        titleColor: prefill.title_text_color,
        description: prefill.tagline,
        descriptionColor: prefill.tagline_text_color,
        image: '',
        logo: '',
        overlay: {
          color: prefill.header_background_color,
          opacity: 100,
        },
        showTitle: true,
        height: 'auto',
        visible: true,
        order: 1,
        showShareButton: true,
        descriptionFontSize: 8,
        titleFontSize: 24,
        links: [],
        video: '',
      },
      {
        id: new Date().getTime(),
        key: 'offerings',
        title: 'Unsere Leistungen',
        showTitle: true,
        description: 'Entdecken Sie unsere vielfältigen Angebote, die speziell auf Ihre Bedürfnisse zugeschnitten sind.',
        visible: true,
        order: 2,
        layout: 'list',
        items: prefill.offerings.map((offering, index) => ({
          id: index + 1,
          title: offering.title,
          description: offering.description,
        })),
      },
    )
  }

  return settings
}
