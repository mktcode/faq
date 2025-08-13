import { settingsFormSchema } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const privateSettings = await readValidatedBody(event, body => settingsFormSchema.shape.private.parse(body))
  const settings = await getSettings(user.id)
  settings.private = privateSettings

  const db = await getDatabaseConnection()
  await db
    .updateTable('users')
    .set({
      settings: JSON.stringify(settings),
    })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
