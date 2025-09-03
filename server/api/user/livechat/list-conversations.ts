import type { WootConversation } from '~~/types/chatwoot'

const apiUrl = 'https://chat.markus-kottlaender.de'

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const { chatwootInboxId } = useRuntimeConfig()

  let sourceId = me.chatwootSourceId

  if (!sourceId) {
    const contact = await chatwoot.createContact(me.id, me.userName)
    sourceId = contact.source_id
  }

  const conversations = await $fetch<WootConversation[]>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${sourceId}/conversations`)

  return { conversations }
})
