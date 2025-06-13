import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

export interface QandaTable {
  id: Generated<number>
  userId: number
  topic: string
  question: string
  questionEmbedding: number[]
  answer: string
  createdAt: ColumnType<string, undefined, undefined>
}

export type Qanda = Selectable<QandaTable>
export type NewQanda = Insertable<QandaTable>
export type QandaUpdate = Updateable<QandaTable>

export const qandaFormSchema = z.object({
  id: z.number().optional(),
  topic: z.string().min(1, 'Topic is required').max(255, 'Topic must be less than 255 characters'),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
})
