import z from "zod"

const bodySchema = z.object({
  plan: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
})

const outputSchema = z.object({
  css: z.string(),
});

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { plan } = await readValidatedBody(event, body => bodySchema.parse(body))

  const instructions = `Erstelle basierend auf dem übergebenen Projektplan für eine Website den globalen CSS Code, der die grundlegenden Design-Richtlinien wie Farben, Schriftarten und Abstände definiert.

Definiere CSS-Variablen (:root) für Farben, Schriftarten und andere wiederverwendbare Stilelemente, die in der gesamten Website verwendet werden können.
Erstelle dann allgemeine CSS-Klassen für häufig verwendete Elemente wie Überschriften, Absätze, Buttons und Layout-Komponenten (z.B. Container, Grid-Systeme).
  `

  const response = await websiteUtils.getOpenAIResponse(instructions, [
    {
      role: 'user',
      content: plan,
    }
  ], outputSchema)

  const db = await getDatabaseConnection()
  const website = await db.selectFrom('websites')
    .selectAll()
    .where('userId', '=', $profile.id)
    .limit(1)
    .executeTakeFirstOrThrow()

  await db.updateTable('websites')
    .set({
      css: response.output.css,
    })
    .where('id', '=', website.id)
    .execute()
})
