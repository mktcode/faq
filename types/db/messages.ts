import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface MessagesTable {
  id: Generated<number>
  customerRequestId: number
  body: string
  embedding: number[] | null
  isCustomer: boolean
  createdAt: ColumnType<Date, string | undefined, never>
}

export type Message = Selectable<MessagesTable>
export type NewMessage = Insertable<MessagesTable>
export type MessageUpdate = Updateable<MessagesTable>