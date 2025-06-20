export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  const db = await getDatabaseConnection()

  if (!user) {
    return { data: null }
  }

  const userInDb = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', user.id)
    .executeTakeFirst()

  return { data: userInDb || null }
})
