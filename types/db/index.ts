import type { UsersTable } from './users'
import type { DomainsTable } from './domains'
import type { CompaniesTable } from './companies'
import type { VcardsTable } from './vcards'
import type { WebsitesTable } from './websites'
import type { PrivacyTable } from './privacy'
import type { WebauthnCredentialsTable } from './webauthnCredentials'
import type { ChatMessagesTable } from './chatMessages'
import type { PaymentsTable } from './payments'
import type { ChargesTable } from './charges'

export * from './users'
export * from './domains'
export * from './companies'
export * from './vcards'
export * from './websites'
export * from './privacy'
export * from './webauthnCredentials'
export * from './chatMessages'
export * from './payments'
export * from './charges'

export interface Database {
  users: UsersTable
  domains: DomainsTable
  companies: CompaniesTable
  vcards: VcardsTable
  websites: WebsitesTable
  privacy: PrivacyTable
  webauthnCredentials: WebauthnCredentialsTable
  chatMessages: ChatMessagesTable
  payments: PaymentsTable
  charges: ChargesTable
}
