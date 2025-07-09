import { settingsFormSchema } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const settings = await db
    .selectFrom('users')
    .select(['settings'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  return settingsFormSchema.parse(
    typeof settings.settings === 'string'
      ? JSON.parse(settings.settings)
      : settings.settings,
  )
})
