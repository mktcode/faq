import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

export interface ChargesTable {
  id: Generated<number>
  userId: number
  amount: number
  createdAt: ColumnType<Date, undefined, undefined>
}

export type Charge = Selectable<ChargesTable>
export type NewCharge = Insertable<ChargesTable>
export type ChargeUpdate = Updateable<ChargesTable>

export const chargeFormSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  amount: z.number(),
})
