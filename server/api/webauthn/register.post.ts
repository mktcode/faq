import { z } from 'zod'
import { defaultSettings } from '~/types/db'

export default defineWebAuthnRegisterEventHandler({
  async validateUser(userBody, event) {
    const session = await getUserSession(event)
    if (session.user?.userName && session.user.userName !== userBody.userName) {
      throw createError({ statusCode: 400, message: 'Username not matching current session' })
    }

    return z.object({
      userName: z.string(),
    }).parse(userBody)
  },
  async onSuccess(event, { credential, user }) {
    console.log('WebAuthn registration successful:', user)
    const db = await getDatabaseConnection()

    const username = makeUsername(user.userName)

    const existingUser = await db
      .selectFrom('users')
      .selectAll()
      .where('userName', '=', username)
      .executeTakeFirst()

    if (existingUser) {
      await setUserSession(event, {
        user: {
          id: existingUser.id,
          name: existingUser.name,
          userName: username,
          email: existingUser.email,
          picture: '',
        },
      })
    }
    else {
      const newUser = await createUser({
        name: user.userName,
        userName: user.userName,
        settings: defaultSettings,
      })

      await setUserSession(event, {
        user: {
          id: newUser.id,
          name: newUser.name,
          userName: username,
          email: newUser.email,
          picture: '',
        },
      })

      await db
        .insertInto('webauthnCredentials')
        .values({
          userId: newUser.id,
          credentialId: credential.id,
          publicKey: credential.publicKey,
          backedUp: false,
          counter: credential.counter,
          transports: credential.transports ? JSON.stringify(credential.transports) : null,
        })
        .execute()
    }
  },
})
