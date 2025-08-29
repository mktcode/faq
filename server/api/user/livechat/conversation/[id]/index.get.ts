import { WootConversation } from "~/types/chatwoot"

const apiUrl = 'https://chat.markus-kottlaender.de'

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const id = getRouterParam(event, 'id')
  const { chatwootInboxId } = useRuntimeConfig()

  const conversation = await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${me.chatwootSourceId}/conversations/${id}`)

  return { conversation }
})
