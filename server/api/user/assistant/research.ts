import OpenAI from 'openai'
import z from 'zod'

const bodySchema = z.object({
  userInput: z.string().min(1, 'Der Rechercheauftrag darf nicht leer sein.'),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  await requireProfileSubscription(user.userName)

  const settings = await getSettings(user.id)
  const { userInput } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { openaiApiKey } = useRuntimeConfig(event)
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  setHeader(event, 'Content-Type', 'application/x-ndjson; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, no-transform')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')
  event.node.res.flushHeaders?.()

  const stream = streamResearchResponse(openai, settings, userInput)

  const ndjson = (async function* () {
    for await (const event of stream) {
      yield JSON.stringify(event) + '\n'
    }
  })()

  return sendIterable(event, ndjson)
})
