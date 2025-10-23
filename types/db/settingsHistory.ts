import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface SettingsHistoryTable {
  id: Generated<number>
  userId: number
  settings: string
  createdAt: ColumnType<Date, string | undefined, never>
}

export type SettingsHistory = Selectable<SettingsHistoryTable>
export type NewSettingsHistory = Insertable<SettingsHistoryTable>
export type SettingsHistoryUpdate = Updateable<SettingsHistoryTable>
