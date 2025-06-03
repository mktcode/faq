import { z } from 'zod'

const querySchema = z.object({
  catalogId: z.string(),
}).transform(query => ({
  catalogId: parseInt(query.catalogId, 10),
}))

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { catalogId } = await getValidatedQuery(event, query => querySchema.parse(query))

  return await db
    .selectFrom('qanda')
    .selectAll()
    .where('catalogId', '=', catalogId)
    .execute()
})
