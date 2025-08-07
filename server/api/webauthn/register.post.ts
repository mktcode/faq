import { z } from 'zod'
import { defaultSettings, settingsFormSchema } from '~/types/db'

export default defineWebAuthnRegisterEventHandler({
  async validateUser(userBody, event) {
    const session = await getUserSession(event)
    if (session.user) {
      throw createError({ statusCode: 400, message: 'User already logged in.' })
    }

    return z.object({
      userName: z.string(),
      settings: settingsFormSchema
    }).parse(userBody)
  },
  async onSuccess(event, { credential, user }) {
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
        settings: user.settings,
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
