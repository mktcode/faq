export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const userInDb = await db.selectFrom('users')
    .select(['domainCode'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  if (!userInDb.domainCode) {
    return []
  }

  const mailboxes = await qboxmail.listMailboxes(userInDb.domainCode)

  return mailboxes
})
