async function list() {
  const db = await getDatabaseConnection()

  return await db.selectFrom('supportBookings').selectAll().execute()
}

export const supportBookingsUtils = {
  list
}
