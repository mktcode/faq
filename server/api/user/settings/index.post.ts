import type { SettingsForm } from '~/types/db'
import { settingsFormSchema } from '~/types/db'

function mergeSettings(
  existingSettings: SettingsForm,
  newSettings: SettingsForm,
) {
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
    .selectFrom('settings')
    .selectAll()
    .where('userId', '=', user.id)
    .executeTakeFirst()

  if (existingSettings) {
    const newSettings = mergeSettings(
      JSON.parse(existingSettings.settings),
      settings,
    )

    await db
      .updateTable('settings')
      .set({
        settings: JSON.stringify(newSettings),
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
