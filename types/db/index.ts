import type { UsersTable } from './users'
import type { WebauthnCredentialsTable } from './webauthnCredentials'
import type { QandaTable } from './qanda'
import type { SettingsTable } from './settings'
import type { CustomerRequestsTable } from './customerRequests'
import type { MessagesTable } from './messages'

export * from './users'
export * from './webauthnCredentials'
export * from './qanda'
export * from './settings'
export * from './customerRequests'
export * from './messages'

export interface Database {
  users: UsersTable
  webauthnCredentials: WebauthnCredentialsTable
  qanda: QandaTable
  settings: SettingsTable
  customerRequests: CustomerRequestsTable
  messages: MessagesTable
}
