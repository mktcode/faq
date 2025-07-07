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
  googleId = null,
}: {
  name: string
  userName: string
  googleId?: string | null
}) {
  const db = await getDatabaseConnection()

  const insertResult = await db
    .insertInto('users')
    .values({
      name,
      userName: makeUsername(userName),
      googleId,
      published: false,
      domain: null,
    })
    .executeTakeFirstOrThrow()

  if (!insertResult.insertId) {
    throw new Error('Failed to insert user')
  }

  const newUserId = Number(insertResult.insertId.toString())

  await db.insertInto('settings')
    .values({
      userId: newUserId,
      settings: JSON.stringify({
        title: name,
        rounded: 'md',
      }),
    })
    .execute()

  const newUser = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', newUserId)
    .executeTakeFirstOrThrow()

  return newUser
}
