import { z } from 'zod'

const querySchema = z.object({
  customerRequestId: z.string(),
}).transform(data => ({
  customerRequestId: parseInt(data.customerRequestId, 10),
}))

export default defineEventHandler(async (event) => {
  const user = await requireSubscription(event)
  const db = await getDatabaseConnection()
  const { customerRequestId } = await getValidatedQuery(event, query => querySchema.parse(query))

  const customerRequest = await db
    .selectFrom('customerRequests')
    .select(['id'])
    .where('userId', '=', user.id)
    .where('id', '=', customerRequestId)
    .executeTakeFirstOrThrow()

  const messages = await db
    .selectFrom('messages')
    .select(['body', 'isCustomer'])
    .where('customerRequestId', '=', customerRequest.id)
    .orderBy('createdAt', 'asc')
    .execute()

  const qanda = await db
    .selectFrom('qanda')
    .select(['id', 'question', 'answer'])
    .where('userId', '=', user.id)
    .execute()

  const openai = createOpenAIClient()

  const response = await openai.responses.create({
    store: false,
    model: 'gpt-4.1-mini',
    instructions: messages.length === 1
      ? 'Schreibe eine Antwort auf die Anfrage des Kunden basierend auf dem bereitgestellten FAQ.'
      : 'Schreibe eine Antwort auf die Anfrage des Kunden basierend auf dem bereitgestellten FAQ und dem bisherigen Gesprächsverlauf.',
    input: [
      {
        role: 'developer',
        content: 'FAQ:\n\n' + qanda.map(item => `Frage: ${item.question}\nAntwort: ${item.answer}`).join('\n\n'),
      },
      {
        role: 'user',
        content: messages.map(msg =>
          msg.isCustomer
            ? `Kunde: ${msg.body}`
            : `Antwort: ${msg.body}`,
        ).join('\n'),
      },
      {
        role: 'developer',
        content: 'Schreibe nun deine Antwort auf die Anfrage des Kunden. Fasse dich kurz und präzise und beende deine Antwort ggf. mit einer weiterführenden Frage an den Kunden.',
      },
    ],
  })

  return response.output_text
})
