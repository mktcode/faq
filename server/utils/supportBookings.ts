import { sql } from "kysely"

async function all() {
  const db = await getDatabaseConnection()

  return await db.selectFrom('supportBookings').select(['id', 'date']).execute()
}

async function next() {
  const db = await getDatabaseConnection()

  return await db
    .selectFrom('supportBookings')
    .innerJoin('users', 'supportBookings.userId', 'users.id')
    .select(['supportBookings.id as id', 'userId', 'userName', 'date', 'notes'])
    .where(sql<boolean>`date > NOW()`)
    .orderBy('date', 'asc')
    .execute()
}

async function listForUser(userId: number) {
  const db = await getDatabaseConnection()

  return await db
    .selectFrom('supportBookings')
    .selectAll()
    .where('userId', '=', userId)
    .execute()
}

async function create(userId: number | null, day: string, time: string, notes: string) {
  const db = await getDatabaseConnection()

  const date = `${day} ${time}`

  const { mailFrom } = useRuntimeConfig()
  const textForAdminNotification = `Ein neuer Support Termin wurde gebucht.
${userId ? `Benutzer ID: ${userId}` : ''}
Datum: ${date}
Notizen: ${notes}
`

  sendEmail({
    to: mailFrom,
    subject: `Neuer Support Termin`,
    text: textForAdminNotification,
    html: textForAdminNotification.replace(/\n/g, '<br>'),
  })

  return await db.insertInto('supportBookings').values({
    userId,
    date,
    notes
  }).execute()
}

export const supportBookingsUtils = {
  all,
  next,
  listForUser,
  create
}
