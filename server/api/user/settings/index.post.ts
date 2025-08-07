import { settingsFormSchema } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const settings = await readValidatedBody(event, body => settingsFormSchema.parse(body))
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
