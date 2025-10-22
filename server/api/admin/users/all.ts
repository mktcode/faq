export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = await getDatabaseConnection()

  const users = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '!=', 1)
    .execute()

  return users.map((user) => ({
    ...user,
    settings: typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings,
  }))
})
