export default defineEventHandler(async (event) => {
  const { public: { appHost } } = useRuntimeConfig()

  const confirmationToken = getQuery(event).confirmEmailToken as string | undefined

  if (confirmationToken) {
    const db = await getDatabaseConnection()

    const user = await db
      .selectFrom('users')
      .select(['id', 'name', 'userName', 'email'])
      .where('emailConfirmationToken', '=', confirmationToken)
      .executeTakeFirst()

    if (user) {
      await db
        .updateTable('users')
        .set({ emailConfirmationToken: null })
        .where('id', '=', user.id)
        .execute()

      return sendRedirect(event, `https://${user.userName}.${appHost}?emailVerified=1`, 302)
    }
  }
})
