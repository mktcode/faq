import { z } from 'zod'

const querySchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { status } = await getValidatedQuery(event, query => querySchema.parse(query))
  const db = await getDatabaseConnection()

  return await db
    .selectFrom('customerRequests')
    .selectAll()
    .where('userId', '=', user.id)
    .where('status', '=', status || 'pending')
    .execute()
})
