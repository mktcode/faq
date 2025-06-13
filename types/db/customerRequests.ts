import type { Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

export interface CustomerRequestsTable {
  id: Generated<number>
  userId: number
  name: string
  email: string | null
  phone: string | null
  message: string
  embedding: number[]
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
}

export type CustomerRequest = Selectable<CustomerRequestsTable>
export type NewCustomerRequest = Insertable<CustomerRequestsTable>
export type CustomerRequestUpdate = Updateable<CustomerRequestsTable>

export const customerRequestFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  embedding: z.array(z.number()),
})
