export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  return await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()
})
