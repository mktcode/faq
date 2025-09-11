export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const { domain, domainContactId } = await db
    .selectFrom('users')
    .select(['domain', 'domainContactId'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  return { domainIsActive: !(domain && domainContactId) }
})
