function makeUsername(name: string): string {
  // TODO: check for uniqueness in the database
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9äöüß]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .substring(0, 30) // Limit to 30 characters
}

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
      const insertResult = await db.insertInto('users')
        .values({
          name: user.name,
          userName: makeUsername(user.name),
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
          email: user.email,
          userName: makeUsername(user.name),
          googleId: user.sub,
        },
        secure: {
          token: tokens.access_token,
        },
      })

      await db.insertInto('settings')
        .values({
          userId: newUserId,
          settings: JSON.stringify({
            title: user.name,
            rounded: 'md',
          }),
        })
        .execute()
    }

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
