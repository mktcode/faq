import { settingsFormSchema } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const settings = await readValidatedBody(event, body => settingsFormSchema.parse(body))
  const db = await getDatabaseConnection()

  const existingSettings = await db
    .selectFrom('settings')
    .selectAll()
    .where('userId', '=', user.id)
    .executeTakeFirst()

  if (existingSettings) {
    await db
      .updateTable('settings')
      .set({
        settings: JSON.stringify(settings),
      })
      .where('userId', '=', user.id)
      .execute()
  }
  else {
    await db
      .insertInto('settings')
      .values({
        userId: user.id,
        settings: JSON.stringify(settings),
      })
      .execute()
  }

  return { success: true }
})
