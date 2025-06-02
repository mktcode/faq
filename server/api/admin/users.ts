export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()

  if (await denies(event, isAdmin)) {
    throw createError({
      status: 403,
      statusMessage: 'Du bist kein Admin.',
    })
  }

  return await db.selectFrom('users').selectAll().execute()
})
