import z from "zod"

const bodySchema = z.object({
  plan: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
})

const outputSchema = z.object({
  store: z.string().describe('Der strukturierte Daten-Store als YAML-String.'),
});

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { plan } = await readValidatedBody(event, body => bodySchema.parse(body))

  const instructions = `Erstelle basierend auf dem übergebenen Projektplan für eine Website die Struktur für den Daten-Store, der die Inhalte und Daten der Website verwaltet.

Bleibe dabei im Rahmen der im Plan beschriebenen Seiten, Sektionen und Funktionalitäten.
Geht es z.B. um einen Shop, sollte der Store Produktdaten, Kategorien, Warenkorb-Informationen etc. enthalten.
Ist ein FAQ geplant, sollte der Store die FAQ-Einträge enthalten.

Halte den Store so einfach und klein wie möglich, um die Wartbarkeit und Performance zu gewährleisten.

Nutze sinnvolle Beispieldaten oder generische Platzhalterwerte für den initialen Store.

YAML-Formatierung ist erforderlich.
Strings MÜSSEN in Anführungszeichen gesetzt werden.
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
      store: response.output.store,
    })
    .where('id', '=', website.id)
    .execute()
})
