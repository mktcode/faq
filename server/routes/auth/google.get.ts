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
      .select(['id', 'email', 'userName'])
      .where('googleId', '=', user.sub)
      .executeTakeFirst()

    if (existingUser) {
      await setUserSession(event, {
        user: {
          ...user,
          id: existingUser.id,
          email: existingUser.email,
          userName: existingUser.userName,
          googleId: user.sub,
        },
        secure: {
          token: tokens.access_token,
        },
      })
    }
    else {
      const newUser = await createUser({
        name: user.name,
        userName: user.name,
        googleId: user.sub,
      })

      await setUserSession(event, {
        user: {
          ...user,
          id: newUser.id,
          email: newUser.email,
          userName: newUser.userName,
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
