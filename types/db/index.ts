import type { UsersTable } from './users'
import type { SettingsHistoryTable } from './settingsHistory'
import type { WebauthnCredentialsTable } from './webauthnCredentials'
import type { QandaTable } from './qanda'
import type { CustomerRequestsTable } from './customerRequests'
import type { MessagesTable } from './messages'
import type { SupportBookingsTable } from './supportBookings'
import type { WebsitesTable } from './websites'
import type { WebsitePagesTable } from './websitePages'
import type { WebsitePartialsTable } from './websitePartials'

export * from './users'
export * from './settingsHistory'
export * from './webauthnCredentials'
export * from './qanda'
export * from './customerRequests'
export * from './messages'
export * from './supportBookings'
export * from './websites'
export * from './websitePages'
export * from './websitePartials'

export interface Database {
  users: UsersTable
  settingsHistory: SettingsHistoryTable
  webauthnCredentials: WebauthnCredentialsTable
  qanda: QandaTable
  customerRequests: CustomerRequestsTable
  messages: MessagesTable
  supportBookings: SupportBookingsTable
  websites: WebsitesTable
  websitePages: WebsitePagesTable
  websitePartials: WebsitePartialsTable
}
