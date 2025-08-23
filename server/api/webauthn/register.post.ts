import { z } from 'zod'
import { settingsFormSchema } from '~/types/db'

export default defineWebAuthnRegisterEventHandler({
  async storeChallenge(event, challenge, attemptId) {
    // Store the challenge in a KV store or DB
    await useStorage().setItem(`attempt:${attemptId}`, challenge)
  },
  async getChallenge(event, attemptId) {
    const challenge = await useStorage().getItem(`attempt:${attemptId}`)

    // Make sure to always remove the attempt because they are single use only!
    await useStorage().removeItem(`attempt:${attemptId}`)

    if (!challenge)
      throw createError({ statusCode: 400, message: 'Challenge expired' })

    return challenge as string
  },
  async validateUser(userBody) {
    return z.object({
      userName: z.string().min(3).max(20),
      settings: settingsFormSchema,
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
      if (user.settings.private.assistant.context) {
        user.settings = await prefillSettings(user.settings)
      }

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
          emailConfirmationToken: newUser.emailConfirmationToken,
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
