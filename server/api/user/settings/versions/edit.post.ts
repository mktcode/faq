import { z } from 'zod'

const bodySchema = z.object({
  versionId: z.number(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { versionId } = await readValidatedBody(event, body => bodySchema.parse(body))

  const db = await getDatabaseConnection()
  const version = await db
    .selectFrom('settingsHistory')
    .select('id')
    .where('userId', '=', user.id)
    .where('id', '=', versionId)
    .executeTakeFirstOrThrow()

  await setUserSession(event, {
    user: {
      editSettingsId: version.id,
    },
  })

  return { success: true }
})
