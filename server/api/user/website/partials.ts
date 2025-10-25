import z from "zod"

const bodySchema = z.object({
  plan: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
  css: z.string().min(1, 'Das CSS darf nicht leer sein.'),
  store: z.string().min(1, 'Der Store darf nicht leer sein.'),
})

const outputSchema = z.object({
  partials: z.array(z.object({
    name: z.string().describe('Der Name des Partials, z.B. header, footer, navigation, etc.'),
    description: z.string().describe('Eine kurze Beschreibung des Partials.'),
    template: z.string().describe('Das Handlebars-Template des Partials.'),
    css: z.string().describe('Zusätzlicher CSS-Code für das Partial.'),
  })).describe('Eine Liste von Partial-Templates.'),
});

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { plan, css, store } = await readValidatedBody(event, body => bodySchema.parse(body))

  const instructions = `Erzeuge eine Reihe von Partial-Templates für wiederkehrende Elemente, z.B. Header, Footer, Navigation, Produkte, Sektionen, etc. basierend auf dem übergebenen Projektplan, dem globalen CSS und den strukturierten Daten.

Jedes Template sollte die grundlegenden HTML-Strukturen und CSS-Klassen enthalten, die in der gesamten Website verwendet werden können.
Außerdem kann jedes Template eigenen CSS-Code enthalten. In den meisten Fällen gibt aber das globale CSS schon alle nötigen Stile vor und vorhandene Klassen sollten wiederverwendet werden.

Nutze Handlebars-Syntax für dynamische Inhalte, z.B. {{title}}, {{description}}, {{#each items}} ... {{/each}}, etc.

Ein Partial ist immer umschlossen von einem div.

Beispiel:

\`\`\`hbs
<div class="product-card">
  <h3>{{this.name}}</h3>
  <p>Price: {{this.price}}</p>
</div>
\`\`\`

Beginne mit den innersten Partials und arbeite dich zu den äußeren Partials vor (z.B. button -> product-card -> product-list -> header).
  `

  const response = await websiteUtils.getOpenAIResponse(instructions, [
    { role: 'user', content: plan },
    { role: 'user', content: css },
    { role: 'user', content: store }
  ], outputSchema)

  const db = await getDatabaseConnection()
  const website = await db.selectFrom('websites')
    .selectAll()
    .where('userId', '=', $profile.id)
    .limit(1)
    .executeTakeFirstOrThrow()

  for (const partial of response.output.partials) {
    await db.insertInto('websitePartials')
      .values({
        websiteId: website.id,
        name: partial.name,
        description: partial.description,
        template: partial.template,
        css: partial.css,
      })
      .execute()
  }
})
