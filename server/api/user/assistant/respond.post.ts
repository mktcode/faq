import OpenAI from 'openai'
import { getSettings } from '~/server/utils/user'
import { getInstructions, streamResponse } from '~/server/utils/assistant'
import z from 'zod'

const bodySchema = z.object({
  userInput: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
  currentOfferIndex: z.number().min(0, 'Der Angebotsindex muss eine positive Zahl sein.').optional(),
  responseId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  await requireProfileSubscription(user.userName)

  const settings = await getSettings(user.id)
  const { userInput, responseId } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { openaiApiKey } = useRuntimeConfig(event)
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  const instructions = getInstructions(settings.public)
  const messages: OpenAI.Responses.ResponseInput = []

  if (!responseId && settings.private.assistant.context) {
    messages.push({
      role: 'developer',
      content: `<company_context>${settings.private.assistant.context}</company_context>`,
    })
  }

  messages.push({
    role: 'user',
    content: userInput,
  })

  setHeader(event, 'Content-Type', 'application/x-ndjson; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, no-transform')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')
  event.node.res.flushHeaders?.()

  const stream = streamResponse(instructions, messages, openai, responseId, user.id, settings.public.company.city)

  const ndjson = (async function* () {
    for await (const event of stream) {
      yield JSON.stringify(event) + '\n'
    }
  })()

  return sendIterable(event, ndjson)
})
