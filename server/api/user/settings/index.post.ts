import type { SettingsForm } from '~/types/db'
import { settingsFormSchema } from '~/types/db'

function mergeSettings(
  existingSettings: SettingsForm | string,
  newSettings: SettingsForm,
) {
  if (typeof existingSettings === 'string') {
    existingSettings = JSON.parse(existingSettings) as SettingsForm
  }

  return {
    ...existingSettings,
    ...newSettings,
  }
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const settings = await readValidatedBody(event, body => settingsFormSchema.parse(body))
  const db = await getDatabaseConnection()

  const existingSettings = await db
    .selectFrom('users')
    .select(['settings'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  const newSettings = mergeSettings(
    existingSettings.settings,
    settings,
  )

  await db
    .updateTable('users')
    .set({
      settings: JSON.stringify(newSettings),
    })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
