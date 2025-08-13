import type { H3Event } from 'h3'
import { settingsFormSchema, type SettingsForm } from '~/types/db'

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
  settings,
}: {
  name: string
  userName: string
  settings: SettingsForm
}) {
  const db = await getDatabaseConnection()

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

  const customerRequestInsertResult = await db
    .insertInto('customerRequests')
    .values({
      userId: newUserId,
      uuid: crypto.randomUUID(),
      name: 'Solihost',
      email: 'support@solihost.de',
      phone: '0176 70 86 46 27',
      status: 'pending',
    })
    .executeTakeFirstOrThrow()

  if (!customerRequestInsertResult.insertId) {
    throw new Error('Failed to insert customer request')
  }

  const newCustomerRequestId = Number(customerRequestInsertResult.insertId.toString())

  await db
    .insertInto('messages')
    .values({
      customerRequestId: newCustomerRequestId,
      body: 'Willkommen bei Solihost! Wir freuen uns, dass Sie sich für unsere Plattform entschieden haben. Bei Fragen oder Anliegen können Sie uns jederzeit kontaktieren.',
      isCustomer: true,
    })
    .execute()

  return newUser
}

// TODO: Should be checked on database level
export function checkSubscriptionStatus(lastPaidAt: Date | string | null): boolean {
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
    .executeTakeFirst()

  if (!userInDb) {
    return null
  }

  const isSubscribed = checkSubscriptionStatus(userInDb.lastPaidAt)

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

  const isSubscribed = checkSubscriptionStatus(user?.lastPaidAt || null) || false

  if (!isSubscribed) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'The profile is not subscribed.',
    })
  }
}

function getValidatedSettings(settings: string | Record<string, unknown>): SettingsForm {
  return settingsFormSchema.parse(typeof settings === 'string' ? JSON.parse(settings) : settings)
}

export async function getSettings(userIdOrName: number | string) {
  const db = await getDatabaseConnection()

  let settings: SettingsForm | null = null

  if (typeof userIdOrName === 'number') {
    const user = await db
      .selectFrom('users')
      .select('settings')
      .where('id', '=', userIdOrName)
      .executeTakeFirstOrThrow()

    settings = getValidatedSettings(user.settings)
  }
  else {
    const user = await db
      .selectFrom('users')
      .select('settings')
      .where('userName', '=', userIdOrName)
      .executeTakeFirstOrThrow()

    settings = getValidatedSettings(user.settings)
  }

  return settings
}

export async function getPublicSettings(userNameOrId: number | string) {
  const settings = await getSettings(userNameOrId)

  return settings.public
}

export async function getPrivateSettings(userNameOrId: number | string) {
  const settings = await getSettings(userNameOrId)

  return settings.private
}
