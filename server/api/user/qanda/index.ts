export default defineEventHandler(async (event) => {
  const $profile = requireProfile(event)
  const db = await getDatabaseConnection()

  return await db
    .selectFrom('qanda')
    .selectAll()
    .where('userId', '=', $profile.id)
    .execute()
})
