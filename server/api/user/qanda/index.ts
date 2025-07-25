export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  return await db
    .selectFrom('qanda')
    .selectAll()
    .where('userId', '=', user.id)
    .execute()
})
