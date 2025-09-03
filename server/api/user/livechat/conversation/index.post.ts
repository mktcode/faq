import z from 'zod'
import type { WootConversation } from '~~/types/chatwoot'

const apiUrl = 'https://chat.markus-kottlaender.de'

const bodySchema = z.object({
  message: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const { message } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { chatwootInboxId } = useRuntimeConfig()

  const newConversation = await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${me.chatwootSourceId}/conversations`, {
    method: 'POST',
  })

  await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${me.chatwootSourceId}/conversations/${newConversation.id}/messages`, {
    method: 'POST',
    body: {
      content: message,
      echo_id: newConversation.id,
    },
  })

  return { success: true, conversationId: newConversation.id }
})
