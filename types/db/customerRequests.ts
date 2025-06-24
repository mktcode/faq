import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface CustomerRequestsTable {
  id: Generated<number>
  userId: number
  uuid: string
  name: string
  email: string | null
  phone: string | null
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: ColumnType<Date, string | undefined, never>
}

export type CustomerRequest = Selectable<CustomerRequestsTable>
export type NewCustomerRequest = Insertable<CustomerRequestsTable>
export type CustomerRequestUpdate = Updateable<CustomerRequestsTable>
