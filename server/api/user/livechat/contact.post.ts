import crypto from 'crypto'
import { z } from 'zod'
import { WootContactCreated } from '~/types/chatwoot'

const apiUrl = 'https://chat.markus-kottlaender.de'

const bodySchema = z.object({
  message: z.string(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { message } = await readValidatedBody(event, body => bodySchema.parse(body))
  const db = await getDatabaseConnection()
  const { inboxIdentifier, chatwootHmacSecret } = useRuntimeConfig()

  try {
    const foundContact = await $fetch(`${apiUrl}/public/api/v1/inboxes/${inboxIdentifier}/contacts/${user.id}`)
    console.log('Found contact:', foundContact)
  } catch (error) {
    console.log('Contact not found, creating new contact...')
  }

  const hmacHash =  crypto
    .createHmac("sha256", chatwootHmacSecret)
    .update(user.id.toString())
    .digest("hex");

  const contact = await $fetch<WootContactCreated>(`${apiUrl}/public/api/v1/inboxes/${inboxIdentifier}/contacts`, {
    method: 'POST',
    body: {
      identifier: user.id.toString(),
      identifier_hash: hmacHash,
      email: user.email,
      name: user.userName,
    },
  })

  await db.updateTable('users')
    .set({
      chatwootSourceId: contact.source_id,
    })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
