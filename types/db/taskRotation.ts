import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface TaskRotationTable {
  id: Generated<number>
  taskName: string
  lastRunAt: ColumnType<Date | null, Date | null, Date | null>
}

export type TaskRotation = Selectable<TaskRotationTable>
export type NewTaskRotation = Insertable<TaskRotationTable>
export type TaskRotationUpdate = Updateable<TaskRotationTable>
