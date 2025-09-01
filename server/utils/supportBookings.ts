async function list() {
  const db = await getDatabaseConnection()

  return await db.selectFrom('supportBookings').select(['date']).execute()
}

async function listForUser(userId: number) {
  const db = await getDatabaseConnection()

  return await db
    .selectFrom('supportBookings')
    .selectAll()
    .where('userId', '=', userId)
    .execute()
}

export const supportBookingsUtils = {
  list,
  listForUser
}
