export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const db = await getDatabaseConnection()

  const existingUser = await db
    .selectFrom('users')
    .select(['published'])
    .where('id', '=', $profile.id)
    .executeTakeFirstOrThrow()

  const isPublished = !existingUser.published

  await db
    .updateTable('users')
    .set({
      published: isPublished,
    })
    .where('id', '=', $profile.id)
    .execute()

  return { success: true, published: isPublished }
})
