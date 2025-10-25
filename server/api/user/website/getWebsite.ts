export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  
  const db = await getDatabaseConnection()

  const website = await db.selectFrom('websites')
    .selectAll()
    .where('userId', '=', $profile.id)
    .limit(1)
    .executeTakeFirst()
  
  return website
})
