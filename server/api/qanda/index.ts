import { z } from 'zod'

const querySchema = z.object({
  username: z.string(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { username } = await getValidatedQuery(event, query => querySchema.parse(query))

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()

  return await db
    .selectFrom('qanda')
    .selectAll()
    .where('userId', '=', user.id)
    .execute()
})
