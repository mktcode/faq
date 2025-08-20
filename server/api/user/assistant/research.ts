import OpenAI from 'openai'
import z from 'zod'

const bodySchema = z.object({
  topic: z.string().min(1, 'Das Thema darf nicht leer sein.'),
  question: z.string().min(1, 'Die Frage darf nicht leer sein.'),
  purpose: z.string().min(1, 'Der Zweck darf nicht leer sein.'),
  depth: z.enum(['shallow', 'deep']),
  userInstructions: z.string(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  await requireProfileSubscription(user.userName)

  const settings = await getSettings(user.id)
  const { topic, question, purpose, depth, userInstructions } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { openaiApiKey } = useRuntimeConfig(event)
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  setHeader(event, 'Content-Type', 'application/x-ndjson; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, no-transform')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')
  event.node.res.flushHeaders?.()

  const stream = streamResearchResponse(openai, user.id, settings, topic, question, purpose, depth, userInstructions)

  const ndjson = (async function* () {
    for await (const event of stream) {
      yield JSON.stringify(event) + '\n'
    }
  })()

  return sendIterable(event, ndjson)
})
