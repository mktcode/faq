import type { Kysely } from 'kysely'
import { SettingsForm } from '~~/types/db'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  const users = await db
    .selectFrom('users')
    .select(['id', 'settings'])
    .execute()
  
  for (const user of users) {
    const settings: SettingsForm = typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings
    settings.public.pages = settings.public.pages.map((page) => ({
      ...page,
      components: page.components.map((component) => {
        if (component.key === 'menu') {
          return {
            ...component,
            items: component.items.map((item, index) => ({
              ...item,
              id: item.id || index + 1,
            })),
          }
        }

        return component
      })
    }))

    await db
        .updateTable('users')
        .set({ settings: JSON.stringify(settings) })
        .where('id', '=', user.id)
        .execute()
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  const users = await db
    .selectFrom('users')
    .select(['id', 'settings'])
    .execute()
  
  for (const user of users) {
    const settings = typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings
    settings.public.pages = settings.public?.pages?.map((page: any) => ({
      ...page,
      components: page.components?.map((component: any) => {
        if (component.key === 'menu') {
          return {
            ...component,
            items: component.items?.map((item: any) => {
              const { id, ...rest } = item
              return rest
            }),
          }
        }

        return component
      })
    }))

    await db
      .updateTable('users')
      .set({ settings: JSON.stringify(settings) })
      .where('id', '=', user.id)
      .execute()
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
