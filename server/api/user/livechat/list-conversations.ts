export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  if (!me.chatwootSourceId) {
    throw createError({ statusCode: 400, statusMessage: 'No chatwoot source ID set' })
  }

  const conversations = chatwoot.listConversations(me.chatwootSourceId)

  return { conversations }
})
