import { z } from 'zod'

const querySchema = z.object({
  catalogId: z.string(),
}).transform(query => ({
  catalogId: parseInt(query.catalogId, 10),
}))

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { catalogId } = await getValidatedQuery(event, query => querySchema.parse(query))

  console.log('Fetching Q&A for user:', user.id, 'in catalog:', catalogId)

  return await db
    .selectFrom('qanda')
    .selectAll()
    .where('userId', '=', user.id)
    .where('catalogId', '=', catalogId)
    .execute()
})
