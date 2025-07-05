export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const existingUser = await db
    .selectFrom('users')
    .select(['published'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  await db
    .updateTable('users')
    .set({
      published: !existingUser.published,
    })
    .where('id', '=', user.id)
    .execute()

  return { success: true, published: !existingUser.published }
})
