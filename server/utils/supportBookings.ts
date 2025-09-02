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

async function create(userId: number, day: string, time: string, notes: string) {
  const db = await getDatabaseConnection()

  const date = `${day} ${time}`

  // TODO: Send email to me

  return await db.insertInto('supportBookings').values({
    userId,
    date,
    notes
  }).execute()
}

export const supportBookingsUtils = {
  list,
  listForUser,
  create
}
