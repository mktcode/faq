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
  await chatwoot.updateLastSeenAt(me.chatwootSourceId, id)

  return { conversation }
})
