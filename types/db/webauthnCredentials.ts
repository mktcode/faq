import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface WebauthnCredentialsTable {
  id: Generated<number>
  userId: number
  credentialId: string
  credentialNickname: string
  publicKey: string
  counter: number
  backedUp: boolean
  transports: string | null
  createdAt: ColumnType<Date, undefined, undefined>
}

export type WebauthnCredential = Selectable<WebauthnCredentialsTable>
export type NewWebauthnCredential = Insertable<WebauthnCredentialsTable>
export type WebauthnCredentialUpdate = Updateable<WebauthnCredentialsTable>
