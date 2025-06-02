import type { UsersTable } from './users'
import type { WebauthnCredentialsTable } from './webauthnCredentials'
import type { PaymentsTable } from './payments'
import type { ChargesTable } from './charges'
import type { CatalogsTable } from './catalogs'
import type { QandaTable } from './qanda'

export * from './users'
export * from './webauthnCredentials'
export * from './payments'
export * from './charges'
export * from './catalogs'
export * from './qanda'

export interface Database {
  users: UsersTable
  webauthnCredentials: WebauthnCredentialsTable
  payments: PaymentsTable
  charges: ChargesTable
  catalogs: CatalogsTable
  qanda: QandaTable
}
