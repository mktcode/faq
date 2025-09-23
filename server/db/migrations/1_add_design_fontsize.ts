import type { Kysely } from 'kysely'

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function up(db: Kysely<any>): Promise<void> {
  const users = await db
    .selectFrom('users')
    .select(['id', 'settings'])
    .execute()
  
  for (const user of users) {
    const settings = typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings
    if (!settings.public?.design?.fontSize) {
      settings.public.design = {
        ...settings.public.design,
        fontSize: 'md',
      }
      await db
        .updateTable('users')
        .set({ settings: JSON.stringify(settings) })
        .where('id', '=', user.id)
        .execute()
    }
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  const users = await db
    .selectFrom('users')
    .select(['id', 'settings'])
    .execute()
  
  for (const user of users) {
    const settings = typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings
    if (settings.public?.design?.fontSize) {
      const { fontSize, ...restDesign } = settings.public.design
      settings.public.design = restDesign
      await db
        .updateTable('users')
        .set({ settings: JSON.stringify(settings) })
        .where('id', '=', user.id)
        .execute()
    }
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
