import type { WootConversation } from '~~/types/chatwoot'

const apiUrl = 'https://chat.markus-kottlaender.de'

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const id = getRouterParam(event, 'id')
  const { chatwootInboxId, chatwootApiKey } = useRuntimeConfig()

  const conversation = await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${me.chatwootSourceId}/conversations/${id}`)

  if (conversation.contact.custom_attributes.userId === me.id) {
    await $fetch<WootConversation>(`${apiUrl}/api/v1/accounts/1/conversations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': chatwootApiKey,
      },
    })

    return { success: true }
  }

  return { success: false }
})
