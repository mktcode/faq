import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

export interface CatalogsTable {
  id: Generated<number>
  userId: number
  name: string
  info: string
  createdAt: ColumnType<string, undefined, undefined>
}

export type Catalog = Selectable<CatalogsTable>
export type NewCatalog = Insertable<CatalogsTable>
export type CatalogUpdate = Updateable<CatalogsTable>

export const catalogFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  info: z.string(),
})
