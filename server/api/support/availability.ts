import { sql } from "kysely"

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  const supportBooking = await db
    .selectFrom('supportBookings')
    .select(['date'])
    .where(sql<boolean>`date BETWEEN NOW() - INTERVAL 120 MINUTE AND NOW()`)
    .limit(1)
    .executeTakeFirst()

  return {
    isAvailable: !supportBooking,
  }
})
