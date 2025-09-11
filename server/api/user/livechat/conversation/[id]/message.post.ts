import z from 'zod'

const bodySchema = z.object({
  message: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const id = getRouterParam(event, 'id')
  const { message } = await readValidatedBody(event, body => bodySchema.parse(body))
  
  if (!me.chatwootSourceId) {
    throw createError({ statusCode: 400, statusMessage: 'No Chatwoot contact associated with this user' })
  }

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'No conversation ID provided' })
  }

  await chatwoot.addMessage(id, me.chatwootSourceId, message)

  return { success: true }
})
