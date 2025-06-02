export default defineOAuthGoogleEventHandler({
  config: {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  },
  async onSuccess(event, { user, tokens }) {
    const db = await getDatabaseConnection()

    const existingUser = await db
      .selectFrom('users')
      .select(['id', 'email'])
      .where('googleId', '=', user.sub)
      .executeTakeFirst()

    if (existingUser) {
      await setUserSession(event, {
        user: {
          ...user,
          id: existingUser.id,
          email: existingUser.email,
          googleId: user.sub,
        },
        secure: {
          token: tokens.access_token,
        },
      })
    }
    else {
      const insertResult = await db.insertInto('users')
        .values({
          name: user.name,
          userName: user.name,
          googleId: user.sub,
          email: user.email,
          balance: 0,
        })
        .executeTakeFirstOrThrow()

      if (!insertResult.insertId) {
        throw new Error('Failed to insert user')
      }

      const newUserId = Number(insertResult.insertId.toString())

      await setUserSession(event, {
        user: {
          ...user,
          id: newUserId,
          googleId: user.sub,
        },
        secure: {
          token: tokens.access_token,
        },
      })
    }

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
