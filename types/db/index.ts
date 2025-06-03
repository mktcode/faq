import type { UsersTable } from './users'
import type { WebauthnCredentialsTable } from './webauthnCredentials'
import type { PaymentsTable } from './payments'
import type { ChargesTable } from './charges'
import type { QandaTable } from './qanda'

export * from './users'
export * from './webauthnCredentials'
export * from './payments'
export * from './charges'
export * from './qanda'

export interface Database {
  users: UsersTable
  webauthnCredentials: WebauthnCredentialsTable
  payments: PaymentsTable
  charges: ChargesTable
  qanda: QandaTable
}
