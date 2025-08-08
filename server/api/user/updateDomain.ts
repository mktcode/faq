import { z } from 'zod'

const bodySchema = z.object({
  domain: z.string(),
})

export default defineEventHandler(async (event) => {
  const { domain } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  await db
    .updateTable('users')
    .set({ domain })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
