export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const db = await getDatabaseConnection()

  const devices = await db
  .selectFrom('webauthnCredentials')
  .select(['credentialId', 'credentialNickname', 'createdAt'])
  .where('userId', '=', $profile.id)
  .execute()

  return devices
})
