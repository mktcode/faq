import type { UsersTable } from './users'
import type { WebauthnCredentialsTable } from './webauthnCredentials'
import type { PaymentsTable } from './payments'
import type { ChargesTable } from './charges'
import type { QandaTable } from './qanda'
import type { SettingsTable } from './settings'
import type { CustomerRequestsTable } from './customerRequests'
import type { MessagesTable } from './messages'

export * from './users'
export * from './webauthnCredentials'
export * from './payments'
export * from './charges'
export * from './qanda'
export * from './settings'
export * from './customerRequests'
export * from './messages'

export interface Database {
  users: UsersTable
  webauthnCredentials: WebauthnCredentialsTable
  payments: PaymentsTable
  charges: ChargesTable
  qanda: QandaTable
  settings: SettingsTable
  customerRequests: CustomerRequestsTable
  messages: MessagesTable
}
