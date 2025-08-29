import { WootConversation } from "~/types/chatwoot"

const apiUrl = 'https://chat.markus-kottlaender.de'

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const { chatwootInboxId } = useRuntimeConfig()

  const conversations = await $fetch<WootConversation[]>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${me.chatwootSourceId}/conversations`)

  return { conversations }
})
