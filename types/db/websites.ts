import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface WebsitesTable {
  id: Generated<number>
  userId: number
  plan: string
  css: string | null
  store: string | null
  createdAt: ColumnType<Date, string | undefined, never>
}

export type Website = Selectable<WebsitesTable>
export type NewWebsite = Insertable<WebsitesTable>
export type WebsiteUpdate = Updateable<WebsitesTable>
