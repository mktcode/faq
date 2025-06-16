import { z } from 'zod'

const inputSchema = z.object({
  customerRequestId: z.string(),
}).transform(data => ({
  customerRequestId: parseInt(data.customerRequestId, 10),
}))

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { customerRequestId } = await getValidatedQuery(event, body => inputSchema.parse(body))

  const customerRequest = await db
    .selectFrom('customerRequests')
    .select(['id'])
    .where('id', '=', customerRequestId)
    .where('userId', '=', user.id)
    .executeTakeFirstOrThrow()

  return await db
    .selectFrom('messages')
    .selectAll()
    .where('customerRequestId', '=', customerRequest.id)
    .execute()
})
