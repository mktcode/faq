import { z } from 'zod'

const bodySchema = z.object({
  versionId: z.number(),
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { versionId } = await readValidatedBody(event, body => bodySchema.parse(body))

  if ($profile.settingsId === versionId) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot delete current settings', message: 'You cannot delete the version that is currently in use. Please switch to a different version before deleting this one.' })
  }

  const db = await getDatabaseConnection()

  const latestOtherVersion = await db
    .selectFrom('settingsHistory')
    .select('id')
    .where('userId', '=', $profile.id)
    .where('id', '!=', versionId)
    .orderBy('createdAt', 'desc')
    .executeTakeFirst()
  
  if (!latestOtherVersion) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot delete last version', message: 'You cannot delete your last settings version. Please create a new version before deleting this one.' })
  }

  await db
    .deleteFrom('settingsHistory')
    .where('userId', '=', $profile.id)
    .where('id', '=', versionId)
    .execute()

  await setUserSession(event, {
    user: {
      editSettingsId: latestOtherVersion.id,
    },
  })

  return { success: true }
})
