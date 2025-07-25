import { z } from 'zod'
import { settingsFormSchema, componentKeys } from '~/types/db'

const displayedComponentsFormSchema = z.array(z.enum(componentKeys)).optional()

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const displayedComponents = await readValidatedBody(event, body => displayedComponentsFormSchema.parse(body))
  const db = await getDatabaseConnection()

  const userSettings = await db
    .selectFrom('users')
    .select(['settings'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  const settings = typeof userSettings.settings === 'string'
    ? JSON.parse(userSettings.settings)
    : userSettings.settings

  settings.displayedComponents = displayedComponents || []

  const updatedSettings = settingsFormSchema.parse(settings)

  await db
    .updateTable('users')
    .set({ settings: JSON.stringify(updatedSettings) })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
