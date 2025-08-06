import { defaultSettings } from "~/types/db"

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: This endpoint is only available in development mode.',
    })
  }

  const db = await getDatabaseConnection()

  const insertResult = await db
    .insertInto('users')
    .values({
      name: 'Dev User',
      userName: 'markus',
      email: 'devuser@example.com',
      settings: JSON.stringify(defaultSettings),
      published: false,
    })
    .executeTakeFirstOrThrow()

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', Number(insertResult.insertId))
    .executeTakeFirstOrThrow()

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      userName: user.userName,
      email: user.email,
    },
  })

  return true
})
