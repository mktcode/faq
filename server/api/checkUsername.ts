import z from 'zod'

const querySchema = z.object({
  userName: z.string().min(3, 'Username must be at least 3 characters long'),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, query => querySchema.parse(query))
  const db = await getDatabaseConnection()

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('userName', '=', query.userName)
    .limit(1)
    .executeTakeFirst()

  return {
    exists: !!user,
  }
})
