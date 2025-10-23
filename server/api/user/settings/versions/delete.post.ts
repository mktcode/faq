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

  await db
    .deleteFrom('settingsHistory')
    .where('userId', '=', $profile.id)
    .where('id', '=', versionId)
    .execute()

  return { success: true }
})
