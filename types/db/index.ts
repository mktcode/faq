import type { UsersTable } from './users'
import type { WebauthnCredentialsTable } from './webauthnCredentials'
import type { QandaTable } from './qanda'
import type { CustomerRequestsTable } from './customerRequests'
import type { MessagesTable } from './messages'
import type { SupportBookingsTable } from './supportBookings'

export * from './users'
export * from './webauthnCredentials'
export * from './qanda'
export * from './customerRequests'
export * from './messages'
export * from './supportBookings'

export interface Database {
  users: UsersTable
  webauthnCredentials: WebauthnCredentialsTable
  qanda: QandaTable
  customerRequests: CustomerRequestsTable
  messages: MessagesTable
  supportBookings: SupportBookingsTable
}
