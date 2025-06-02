import { z } from 'zod'

export default defineWebAuthnRegisterEventHandler({
  // optional
  async validateUser(userBody, event) {
    // bonus: check if the user is already authenticated to link a credential to his account
    // We first check if the user is already authenticated by getting the session
    // And verify that the email is the same as the one in session
    const session = await getUserSession(event)
    if (session.user?.userName && session.user.userName !== userBody.userName) {
      throw createError({ statusCode: 400, message: 'Username not matching current session' })
    }

    return z.object({
      userName: z.string(),
    }).parse(userBody)
  },
  async onSuccess(event, { credential, user }) {
    // The credential creation has been successful
    // We need to create a user if it does not exist
    const db = await getDatabaseConnection()

    // Get the user from the database
    let dbUser = await db
      .selectFrom('users')
      .selectAll()
      .where('userName', '=', user.userName)
      .executeTakeFirst()

    if (!dbUser) {
      // Store new user in database
      const result = await db
        .insertInto('users')
        .values({
          name: user.userName,
          userName: user.userName,
          googleId: '',
          balance: 0,
        })
        .executeTakeFirstOrThrow()

      // Get the newly created user
      dbUser = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', Number(result.insertId))
        .executeTakeFirstOrThrow()
    }

    // Store the credential in our database
    await db
      .insertInto('webauthnCredentials')
      .values({
        userId: dbUser.id,
        credentialId: credential.id,
        publicKey: credential.publicKey,
        backedUp: false,
        counter: credential.counter,
        transports: credential.transports ? JSON.stringify(credential.transports) : null,
      })
      .execute()

    // Set the user session
    await setUserSession(event, {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        userName: dbUser.userName,
        email: dbUser.email,
        googleId: dbUser.googleId,
        picture: '',
      },
      loggedInAt: Date.now(),
    })
  },
})
