export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const catalogs = await db
    .selectFrom('catalogs')
    .selectAll()
    .where('userId', '=', user.id)
    .execute()

  if (catalogs.length === 0) {
    const defaultCatalog = {
      userId: user.id,
      name: 'Default Catalog',
      info: 'A catalog about my business.',
    }

    await db.insertInto('catalogs').values(defaultCatalog).execute()

    return await db
      .selectFrom('catalogs')
      .selectAll()
      .where('userId', '=', user.id)
      .execute()
  }

  return catalogs
})
