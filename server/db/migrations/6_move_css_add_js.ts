import type { Kysely } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  const users = await db
    .selectFrom('users')
    .select(['id', 'settings'])
    .execute()
  
  for (const user of users) {
    const settings = typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings
    settings.public.design.css = settings.public.css || ''
    delete settings.public.css
    settings.public.design.js = ''

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
    settings.public.css = settings.public.design.css || ''
    delete settings.public.design.css
    delete settings.public.design.js

    await db
      .updateTable('users')
      .set({ settings: JSON.stringify(settings) })
      .where('id', '=', user.id)
      .execute()
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
