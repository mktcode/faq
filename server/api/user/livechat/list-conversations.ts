export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  let contactSourceId = me.chatwootSourceId

  if (!contactSourceId) {
    const newContact = await chatwoot.createContact(me.id, me.userName)
    contactSourceId = newContact.source_id
  }

  const conversations = await chatwoot.listConversations(contactSourceId)

  const hasUnreadMessages = conversations.some(conv => conv.contact_last_seen_at < Math.max(...conv.messages.map(msg => msg.created_at)))

  return { conversations, hasUnreadMessages }
})
