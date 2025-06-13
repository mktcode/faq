import { z } from 'zod'

const querySchema = z.object({
  customerRequestId: z.string(),
}).transform(data => ({
  customerRequestId: parseInt(data.customerRequestId, 10),
}))

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { customerRequestId } = await getValidatedQuery(event, query => querySchema.parse(query))

  const customerRequest = await db
    .selectFrom('customerRequests')
    .select(['message'])
    .where('userId', '=', user.id)
    .where('id', '=', customerRequestId)
    .executeTakeFirstOrThrow()

  const qanda = await db
    .selectFrom('qanda')
    .select(['id', 'question', 'answer'])
    .where('userId', '=', user.id)
    .execute()

  const openai = createOpenAIClient()

  const response = await openai.responses.create({
    store: false,
    model: 'gpt-4.1-mini',
    instructions: 'Schreibe eine Antwort auf die Anfrage des Kunden basierend auf dem bereitgestellten FAQ.',
    input: [
      {
        role: 'developer',
        content: qanda.map(item => `Frage: ${item.question}\nAntwort: ${item.answer}`).join('\n\n'),
      },
      {
        role: 'user',
        content: 'Frage des Kunden: ' + customerRequest.message,
      },
      {
        role: 'developer',
        content: 'Schreibe nun deine Antwort auf die Anfrage des Kunden. Fasse dich kurz und präzise und beende deine Antwort ggf. mit einer weiterführenden Frage an den Kunden.',
      },
    ],
  })

  return response.output_text
})
