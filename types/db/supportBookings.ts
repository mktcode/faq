import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface SupportBookingsTable {
  id: Generated<number>
  userId: number
  date: ColumnType<Date, string | undefined, never>
  createdAt: ColumnType<Date, string | undefined, never>
}

export type SupportBooking = Selectable<SupportBookingsTable>
export type NewSupportBooking = Insertable<SupportBookingsTable>
export type SupportBookingUpdate = Updateable<SupportBookingsTable>
