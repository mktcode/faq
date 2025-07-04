export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: This endpoint is only available in development mode.',
    })
  }

  const db = await getDatabaseConnection()

  const user = await db
    .selectFrom('users')
    .selectAll()
    .limit(1)
    .executeTakeFirst()

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found: Dev User not found.',
    })
  }

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
