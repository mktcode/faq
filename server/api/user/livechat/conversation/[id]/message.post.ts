import z from "zod"
import { WootConversation } from "~/types/chatwoot"

const apiUrl = 'https://chat.markus-kottlaender.de'

const bodySchema = z.object({
  message: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)
  const id = getRouterParam(event, 'id')
  const { message } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { chatwootInboxId } = useRuntimeConfig()

  await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${me.chatwootSourceId}/conversations/${id}/messages`, {
    method: 'POST',
    body: {
      content: message,
      echo_id: id
    }
  })

  return { success: true }
})
