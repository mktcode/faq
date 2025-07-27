import { z } from 'zod'

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
        settings: {
          font: 'montserrat',
          color: 'black',
          title: 'Herzlich Willkommen',
          description: 'Auf unserer Website von Solihost.de',
          headerTitleColor: 'black',
          headerTitleFontSize: 10,
          headerDescriptionColor: 'black',
          headerDescriptionFontSize: 6,
          headerImageOverlay: {
            color: 'black',
            opacity: 4,
          },
          displayedComponents: ['offer', 'gallery', 'form', 'faq', 'downloads'],
          form: {
            title: 'Anfrage',
            description: 'Wir freuen uns auf Ihre Nachricht!',
          },
        }
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
