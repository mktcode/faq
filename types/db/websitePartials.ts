import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface WebsitePartialsTable {
  id: Generated<number>
  websiteId: number
  name: string
  description: string
  template: string
  css: string
}

export type WebsitePartial = Selectable<WebsitePartialsTable>
export type NewWebsitePartial = Insertable<WebsitePartialsTable>
export type WebsitePartialUpdate = Updateable<WebsitePartialsTable>
