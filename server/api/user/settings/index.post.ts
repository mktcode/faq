import type { SettingsForm } from '~/types/db'
import { settingsFormSchema } from '~/types/db'

function mergeSettings(
  existingSettings: SettingsForm,
  changes: Partial<SettingsForm>,
) {
  return {
    ...existingSettings,
    ...changes,
  }
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const changes = await readValidatedBody(event, body => settingsFormSchema.partial().parse(body))
  const db = await getDatabaseConnection()

  const existingSettingsString = await db
    .selectFrom('users')
    .select(['settings'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()
  
  const existingSettings = typeof existingSettingsString.settings === 'string'
    ? JSON.parse(existingSettingsString.settings) as SettingsForm
    : existingSettingsString.settings as SettingsForm

  if (changes.components?.gallery) {
    for (const image of existingSettings.components.gallery.items || []) {
      if (!changes.components.gallery.items.includes(image)) {
        const fileKey = getKeyFromUrl(image.url)
        await deleteFile(user.id, fileKey)
      }
    }
  }
  if (changes.components?.downloads) {
    for (const file of existingSettings.components.downloads.items || []) {
      if (!changes.components.downloads.items.includes(file)) {
        const fileKey = getKeyFromUrl(file.url)
        await deleteFile(user.id, fileKey)
      }
    }
  }

  const newSettings = mergeSettings(
    existingSettings,
    changes,
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
