import z from "zod"

const bodySchema = z.object({
  plan: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
  css: z.string().min(1, 'Das CSS darf nicht leer sein.'),
  store: z.string().min(1, 'Der Store darf nicht leer sein.'),
  partials: z.array(z.object({
    name: z.string().describe('Der Name des Partials, z.B. header, footer, navigation, etc.'),
    description: z.string().describe('Eine kurze Beschreibung des Partials.'),
    template: z.string().describe('Das Handlebars-Template des Partials.'),
    css: z.string().describe('Zusätzlicher CSS-Code für das Partial.'),
  })).describe('Eine Liste von Partial-Templates.'),
})

const outputSchema = z.object({
  pages: z.array(z.object({
    name: z.string().describe('Der Name der Seite, z.B. Startseite, Über uns, Kontakt, etc.'),
    description: z.string().describe('Eine kurze Beschreibung der Seite.'),
    template: z.string().describe('Das Handlebars-Template der Seite.'),
  })).describe('Eine Liste von Seiten-Templates.'),
});

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { plan, css, store, partials } = await readValidatedBody(event, body => bodySchema.parse(body))

  const instructions = `Erzeuge Page-Templates basierend auf dem übergebenen Projektplan, dem globalen CSS und den strukturierten Daten.

Template-Engine: Handlebars

Nutze ausschließlich die Partials und ein umschließendes <div id="page">.
Den üblichen HTML-Grundaufbau (<!DOCTYPE html>, <html>, <head>, <body>) musst du nicht erstellen, NUR DAS page div.

Zum Beispiel:

\`\`\`hbs
<div id="page">
  {{>header}}
  <main>
    <h1>{{title}}</h1>
    <p>{{description}}</p>
    {{>product-list}}
  </main>
  {{>footer}}
</div>
\`\`\`
`
  const response = await websiteUtils.getOpenAIResponse(instructions, [
    { role: 'user', content: plan },
    { role: 'user', content: css },
    { role: 'user', content: store },
    { role: 'user', content: partials.map(p => {
      return `Partial Name: ${p.name}\nDescription: ${p.description}\nTemplate:\n${p.template}`
    }).join('\n\n') }
  ], outputSchema)

  const db = await getDatabaseConnection()
  const website = await db.selectFrom('websites')
    .selectAll()
    .where('userId', '=', $profile.id)
    .limit(1)
    .executeTakeFirstOrThrow()

  for (const page of response.output.pages) {
    await db.insertInto('websitePages')
      .values({
        websiteId: website.id,
        name: page.name,
        description: page.description,
        template: page.template,
        css: '',
        js: '',
      })
      .execute()
  }
})
