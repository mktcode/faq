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
    settings.public.company.lastMod = new Date().toISOString()
    settings.public.pages = settings.public.pages.map((page) => ({
      ...page,
      lastMod: new Date().toISOString(),
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
    delete settings.public?.company?.lastMod
    settings.public.pages = settings.public.pages.map((page: any) => {
      const { lastMod, ...rest } = page
      return rest
    })

    await db
      .updateTable('users')
      .set({ settings: JSON.stringify(settings) })
      .where('id', '=', user.id)
      .execute()
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
