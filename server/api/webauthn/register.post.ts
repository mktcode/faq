import { z } from 'zod'
import { settingsFormSchema } from '~/types/db'

export default defineWebAuthnRegisterEventHandler({
  async storeChallenge(_event, challenge, attemptId) {
    // Store the challenge in a KV store or DB
    await useStorage().setItem(`attempt:${attemptId}`, challenge)
  },
  async getChallenge(_event, attemptId) {
    const challenge = await useStorage().getItem(`attempt:${attemptId}`)

    // Make sure to always remove the attempt because they are single use only!
    await useStorage().removeItem(`attempt:${attemptId}`)

    if (!challenge)
      throw createError({ statusCode: 400, message: 'Challenge expired' })

    return challenge as string
  },
  async validateUser(userBody) {
    return z.object({
      userName: z.string().min(3).max(25),
      settings: settingsFormSchema.optional(),
      otp: z.string().optional(),
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

    if (
      user.otp &&
      existingUser &&
      existingUser.oneTimePassword &&
      existingUser.oneTimePasswordCreatedAt
    ) {
      const secondsLeft = Math.max(0, Math.floor((existingUser.oneTimePasswordCreatedAt.getTime() + 15 * 60 * 1000 - Date.now()) / 1000))

      if (secondsLeft > 0 && user.otp === existingUser.oneTimePassword) {
        await db
          .insertInto('webauthnCredentials')
          .values({
            userId: existingUser.id,
            credentialId: credential.id,
            publicKey: credential.publicKey,
            backedUp: false,
            counter: credential.counter,
            transports: credential.transports ? JSON.stringify(credential.transports) : null,
          })
          .execute()

        await db
          .updateTable('users')
          .set({
            oneTimePassword: null,
            oneTimePasswordCreatedAt: null,
          })
          .where('id', '=', existingUser.id)
          .execute()

        await setUserSession(event, {
          user: {
            id: existingUser.id,
            name: existingUser.name,
            userName: username,
            email: existingUser.email,
            picture: '',
            emailConfirmationToken: existingUser.emailConfirmationToken,
          },
        })
      }
    }
    else if (user.settings && !existingUser) {
      if (user.settings.private.assistant.context) {
        user.settings = await prefillSettings(user.settings)
      }

      const newUser = await createUser({
        name: username,
        userName: username,
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
