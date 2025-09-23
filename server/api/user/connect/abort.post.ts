export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const db = await getDatabaseConnection()

  await db
    .updateTable('users')
    .set({
      oneTimePassword: null,
      oneTimePasswordCreatedAt: null
    })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
