import crypto from 'crypto'
import { WootContactCreated } from '~/types/chatwoot';

const apiUrl = 'https://chat.markus-kottlaender.de'

async function createContact(userId: number, name: string) {
  const { chatwootInboxId, chatwootHmacSecret } = useRuntimeConfig()
  const db = await getDatabaseConnection()

  const hmacHash =  crypto
    .createHmac("sha256", chatwootHmacSecret)
    .update(userId.toString())
    .digest("hex");

  const contact = await $fetch<WootContactCreated>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts`, {
    method: 'POST',
    body: {
      identifier: userId,
      identifier_hash: hmacHash,
      name,
    },
  })

  await db.updateTable('users')
    .set({
      chatwootSourceId: contact.source_id,
    })
    .where('id', '=', userId)
    .execute()

  return contact
}

export const chatwoot = {
  createContact,
}
