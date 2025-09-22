export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  if (!me.chatwootSourceId) {
    throw createError({ statusCode: 400, statusMessage: 'No chatwoot source ID set' })
  }

  const conversations = await chatwoot.listConversations(me.chatwootSourceId)

  const hasUnreadMessages = conversations.some(conv => conv.contact_last_seen_at < Math.max(...conv.messages.map(msg => msg.created_at)))

  return { conversations, hasUnreadMessages }
})
