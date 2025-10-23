export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  
  const db = await getDatabaseConnection()
  const settings = await db
    .selectFrom('settingsHistory')
    .select(['id', 'settings', 'note', 'createdAt'])
    .where('userId', '=', $profile.id)
    .execute()

  return settings
})
