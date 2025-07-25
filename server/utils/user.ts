import type { H3Event } from 'h3'
import type { SettingsForm } from '~/types/db'

export function makeUsername(name: string): string {
  // TODO: check for uniqueness in the database
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9äöüß]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .substring(0, 30)
}

export async function createUser({
  name,
  userName,
}: {
  name: string
  userName: string
}) {
  const db = await getDatabaseConnection()

  const settings: SettingsForm = {
    title: name,
    headerTitleColor: 'black',
    headerTitleFontSize: 10,
    headerDescriptionColor: 'black',
    headerDescriptionFontSize: 6,
    displayedComponents: ['offer', 'gallery', 'form', 'faq', 'downloads'],
    form: {
      title: 'Anfrage',
      description: 'Wir freuen uns auf Ihre Nachricht!',
    },
  }

  const insertResult = await db
    .insertInto('users')
    .values({
      name,
      userName: makeUsername(userName),
      published: false,
      domain: null,
      settings: JSON.stringify(settings),
    })
    .executeTakeFirstOrThrow()

  if (!insertResult.insertId) {
    throw new Error('Failed to insert user')
  }

  const newUserId = Number(insertResult.insertId.toString())

  const newUser = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', newUserId)
    .executeTakeFirstOrThrow()

  return newUser
}

// TODO: Should be checked on database level
export function checkSubscribed(lastPaidAt: Date | string | null): boolean {
  if (!lastPaidAt) {
    return false
  }
  const lastPaidDate = new Date(lastPaidAt)
  return lastPaidDate > new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)
}

export async function getMe(event: H3Event) {
  const { user } = await getUserSession(event)
  const db = await getDatabaseConnection()

  if (!user) {
    return null
  }

  const userInDb = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  const isSubscribed = checkSubscribed(userInDb.lastPaidAt)

  return {
    ...userInDb,
    isSubscribed,
  }
}

export async function requireSubscription(event: H3Event) {
  const user = await getMe(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'You must be logged in to access this resource.',
    })
  }

  if (!user.isSubscribed) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You must have an active subscription to access this resource.',
    })
  }

  return user
}

export async function requireProfileSubscription(username: string) {
  const db = await getDatabaseConnection()
  const user = await db
    .selectFrom('users')
    .select(['lastPaidAt'])
    .where('userName', '=', username)
    .executeTakeFirst()

  const isSubscribed = checkSubscribed(user?.lastPaidAt || null) || false

  if (!isSubscribed) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'The profile is not subscribed.',
    })
  }
}
