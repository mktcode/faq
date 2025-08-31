import { getSettings } from '~/server/utils/user'
import z from 'zod'

const bodySchema = z.object({
  userInput: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
  currentOfferIndex: z.number().min(0, 'Der Angebotsindex muss eine positive Zahl sein.').optional(),
  responseId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  if (!event.context.profile?.subscription.plan) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You must have an active subscription to access this resource.',
    })
  }

  const settings = await getSettings(user.id)
  const { userInput, responseId } = await readValidatedBody(event, body => bodySchema.parse(body))

  setHeader(event, 'Content-Type', 'application/x-ndjson; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, no-transform')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')
  event.node.res.flushHeaders?.()

  const stream = assistant.streamResponse(userInput, settings, responseId)

  const ndjson = (async function* () {
    for await (const event of stream) {
      yield JSON.stringify(event) + '\n'
    }
  })()

  return sendIterable(event, ndjson)
})
