export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const id = getRouterParam(event, 'id')
  
  if (!me.chatwootSourceId) {
    throw createError({ statusCode: 400, statusMessage: 'No Chatwoot contact associated with this user' })
  }

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'No conversation ID provided' })
  }

  const conversation = await chatwoot.getConversation(id, me.chatwootSourceId)

  if (conversation.contact.custom_attributes.userId === me.id) {
    await chatwoot.deleteConversation(conversation.id.toString())

    return { success: true }
  }

  return { success: false }
})
