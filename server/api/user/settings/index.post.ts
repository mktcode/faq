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

  const existingSettingsString = await db
    .selectFrom('users')
    .select(['settings'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()
  
  const existingSettings = typeof existingSettingsString.settings === 'string'
    ? JSON.parse(existingSettingsString.settings) as SettingsForm
    : existingSettingsString.settings as SettingsForm

  if (settings.gallery) {
    for (const image of existingSettings.gallery || []) {
      if (!settings.gallery.includes(image)) {
        const fileKey = getKeyFromUrl(image.url)
        await deleteFile(user.id, fileKey)
      }
    }
  }
  if (settings.downloads) {
    for (const file of existingSettings.downloads || []) {
      if (!settings.downloads.includes(file)) {
        const fileKey = getKeyFromUrl(file.url)
        await deleteFile(user.id, fileKey)
      }
    }
  }

  const newSettings = mergeSettings(
    existingSettings,
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
