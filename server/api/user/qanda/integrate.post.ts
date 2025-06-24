import z from 'zod'
import { zodTextFormat } from 'openai/helpers/zod'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const qanda = await db
    .selectFrom('qanda')
    .select(['id', 'question', 'answer'])
    .where('userId', '=', user.id)
    .execute()

  const messages = await db
    .selectFrom('messages')
    .innerJoin('customerRequests', 'messages.customerRequestId', 'customerRequests.id')
    .select(['messages.body', 'messages.isCustomer', 'customerRequests.id as customerRequestId'])
    .where('customerRequests.userId', '=', user.id)
    .orderBy('customerRequests.id', 'asc')
    .execute()

  const openai = createOpenAIClient()

  const outputSchema = z.object({
    updates: z.array(z.object({
      qandaId: z.number().optional().nullable(),
      question: z.string(),
      answer: z.string(),
    })),
  })

  const response = await openai.responses.parse({
    store: false,
    model: 'gpt-4.1-mini',
    instructions: 'Du bekommst nun ein existierendes FAQ und einige Kundenanfragen und Antworten. Du sollst Aktualisierungen am FAQ vornehmen, um es zu verbessern und neue Informationen zu integrieren. Du kannst dazu neue Frage und Antwort-Paare hinzufügen oder bestehende Paare ändern (indem du die ID angibst).',
    input: [
      {
        role: 'developer',
        content: 'FAQ:\n\n' + qanda.map(item => `ID: ${item.id}\nFrage: ${item.question}\nAntwort: ${item.answer}`).join('\n\n'),
      },
      {
        role: 'developer',
        content: messages.map(msg =>
          msg.isCustomer
            ? `Kunde: ${msg.body}`
            : `Antwort: ${msg.body}`,
        ).join('\n'),
      },
      {
        role: 'developer',
        content: 'Welche Änderungen würdest du am FAQ vornehmen, um es zu verbessern? Halte dich stricht an die angegebene Struktur.',
      },
    ],
    text: {
      format: zodTextFormat(outputSchema, 'faqUpdates'),
    },
  })

  console.log('Response from OpenAI:', response.output_parsed)

  return response.output_parsed
})
