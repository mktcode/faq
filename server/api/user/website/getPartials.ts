export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  
  const db = await getDatabaseConnection()

  const website = await db.selectFrom('websites')
    .selectAll()
    .where('userId', '=', $profile.id)
    .limit(1)
    .executeTakeFirst()
  
  if (!website) {
    return []
  }

  const partials = await db.selectFrom('websitePartials')
    .selectAll()
    .where('websiteId', '=', website.id)
    .execute()
  
  return partials
})
