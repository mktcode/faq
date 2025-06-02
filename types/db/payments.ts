import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

export interface PaymentsTable {
  id: Generated<number>
  userId: number
  amount: number
  description: string | null
  paymentMethod: string | null
  transactionId: string | null
  status: string | undefined
  createdAt: ColumnType<Date, undefined, undefined>
}

export type Payment = Selectable<PaymentsTable>
export type NewPayment = Insertable<PaymentsTable>
export type PaymentUpdate = Updateable<PaymentsTable>

export const paymentFormSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  amount: z.number(),
  description: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
  transactionId: z.string().nullable().optional(),
  status: z.string().default('completed'),
})
