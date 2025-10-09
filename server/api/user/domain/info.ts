export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const db = await getDatabaseConnection()

  const { domain, domainContactId } = await db
    .selectFrom('users')
    .select(['domain', 'domainContactId'])
    .where('id', '=', $profile.id)
    .executeTakeFirstOrThrow()

  const hasARecord = domain ? await domainUtils.checkA(domain) : false
  const hasMXRecords = domain ? await domainUtils.checkMx(domain) : false

  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate delay for better UX

  return { domainIsActive: !!domainContactId, hasARecord, hasMXRecords }
})
