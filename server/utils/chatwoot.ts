import crypto from 'crypto'
import type { WootContactCreated, WootConversation } from '~~/types/chatwoot'

const apiUrl = 'https://chat.markus-kottlaender.de'

async function createContact(userId: number, name: string) {
  const { chatwootInboxId, chatwootHmacSecret } = useRuntimeConfig()
  const db = await getDatabaseConnection()

  const hmacHash = crypto
    .createHmac('sha256', chatwootHmacSecret)
    .update(userId.toString())
    .digest('hex')

  const contact = await $fetch<WootContactCreated>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts`, {
    method: 'POST',
    body: {
      identifier: userId,
      identifier_hash: hmacHash,
      name,
      custom_attributes: {
        userId,
      },
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

async function listConversations(sourceId: string) {
  const { chatwootInboxId } = useRuntimeConfig()

  return await $fetch<WootConversation[]>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${sourceId}/conversations`)
}

async function updateLastSeenAt(sourceId: string, conversationId: string) {
  const { chatwootInboxId } = useRuntimeConfig()

  await $fetch(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${sourceId}/conversations/${conversationId}/update_last_seen`, {
    method: 'POST',
  })
}

async function startConversation(sourceId: string, message: string) {
  const { chatwootInboxId } = useRuntimeConfig()

  const newConversation = await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${sourceId}/conversations`, {
    method: 'POST',
  })

  await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${sourceId}/conversations/${newConversation.id}/messages`, {
    method: 'POST',
    body: {
      content: message,
      echo_id: newConversation.id,
    },
  })

  return newConversation
}

async function deleteConversation(id: string) {
  const { chatwootApiKey } = useRuntimeConfig()

  await $fetch<WootConversation>(`${apiUrl}/api/v1/accounts/1/conversations/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'api_access_token': chatwootApiKey,
    },
  })
}

async function getConversation(id: string, sourceId: string) {
  const { chatwootInboxId } = useRuntimeConfig()

  return await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${sourceId}/conversations/${id}`)
}

async function addMessage(conversationId: string, sourceId: string, message: string) {
  const { chatwootInboxId } = useRuntimeConfig()

  await $fetch<WootConversation>(`${apiUrl}/public/api/v1/inboxes/${chatwootInboxId}/contacts/${sourceId}/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: {
      content: message,
      echo_id: conversationId,
    },
  })
}

export const chatwoot = {
  createContact,
  listConversations,
  updateLastSeenAt,
  startConversation,
  deleteConversation,
  getConversation,
  addMessage,
}
