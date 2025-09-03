export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const currentDomainInfo = await db
    .selectFrom('users')
    .select(['domain', 'domainContactId'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  if (!currentDomainInfo.domain) {
    return { info: null, error: 'No domain registered.' }
  }

  return await autodns.domainInfo(currentDomainInfo.domain)
})
