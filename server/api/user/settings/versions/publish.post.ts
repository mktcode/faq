import { z } from 'zod'

const bodySchema = z.object({
  versionId: z.number(),
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { versionId } = await readValidatedBody(event, body => bodySchema.parse(body))

  const db = await getDatabaseConnection()

  await db
    .updateTable('users')
    .set({ settings: versionId })
    .where('id', '=', $profile.id)
    .execute()

  return { success: true }
})
