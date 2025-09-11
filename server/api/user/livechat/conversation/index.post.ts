import z from 'zod'

const bodySchema = z.object({
  message: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const { message } = await readValidatedBody(event, body => bodySchema.parse(body))
  
  if (!me.chatwootSourceId) {
    throw createError({ statusCode: 400, statusMessage: 'No chatwoot source ID set' })
  }

  const newConversation = await chatwoot.startConversation(me.chatwootSourceId, message)

  return { success: true, conversationId: newConversation.id }
})
