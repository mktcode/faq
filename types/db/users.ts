import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface UsersTable {
  id: Generated<number>
  name: string
  userName: string
  email: string | null
  googleId: string
  balance: number
  createdAt: ColumnType<Date, undefined, undefined>
  hasEmailAccess: boolean
  hasWebsiteAccess: boolean
  hasVcardAccess: boolean
  hasGoogleMyBusinessAccess: boolean
  hasEInvoiceAccess: boolean
}
export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>
