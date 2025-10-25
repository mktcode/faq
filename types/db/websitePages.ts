import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface WebsitePagesTable {
  id: Generated<number>
  websiteId: number
  name: string
  description: string
  template: string
  css: string
  js: string
}

export type WebsitePage = Selectable<WebsitePagesTable>
export type NewWebsitePage = Insertable<WebsitePagesTable>
export type WebsitePageUpdate = Updateable<WebsitePagesTable>
