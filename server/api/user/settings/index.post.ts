import { settingsFormSchema } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const publicSettings = await readValidatedBody(event, body => settingsFormSchema.shape.public.parse(body))
  const settings = await getSettings(user.id)
  settings.public = publicSettings

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
