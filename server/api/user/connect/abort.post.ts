export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)

  const db = await getDatabaseConnection()

  await db
    .updateTable('users')
    .set({
      oneTimePassword: null,
      oneTimePasswordCreatedAt: null
    })
    .where('id', '=', $profile.id)
    .execute()

  return { success: true }
})
