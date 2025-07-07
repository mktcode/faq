import z from 'zod'

export default defineEventHandler(async (event) => {
  const user = await requireSubscription(event)
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
      format: {
        type: 'json_schema',
        name: 'updates',
        schema: {
          type: 'object',
          properties: {
            updates: {
              type: 'array',
              description: 'Eine Liste von Änderungen, die am FAQ vorgenommen werden sollen.',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: ['number', 'null'],
                    description: 'Die ID des FAQ-Eintrags, der aktualisiert werden soll. Wenn dieser Eintrag neu ist, kann dieses Feld weggelassen werden.',
                  },
                  question: {
                    type: 'string',
                    description: 'Die aktualisierte Frage für den FAQ-Eintrag.',
                  },
                  answer: {
                    type: 'string',
                    description: 'Die aktualisierte Antwort für den FAQ-Eintrag.',
                  },
                },
                required: ['id', 'question', 'answer'],
                additionalProperties: false,
              },
              additionalProperties: false,
            },
          },
          required: ['updates'],
          additionalProperties: false,
        },
      },
    },
  })

  const updatesSchema = z.object({
    updates: z.array(
      z.object({
        id: z.union([z.number(), z.null()]),
        question: z.string(),
        answer: z.string(),
      }),
    ),
  })
  const { updates } = updatesSchema.parse(response.output_parsed)

  return updates.map((update) => {
    return {
      ...update,
      original: qanda.find(item => item.id === update.id) || null,
    }
  })
})
