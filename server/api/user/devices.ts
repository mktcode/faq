export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const devices = await db
  .selectFrom('webauthnCredentials')
  .select(['credentialId', 'createdAt'])
  .where('userId', '=', user.id)
  .execute()

  return devices
})
