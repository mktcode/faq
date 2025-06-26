export default defineWebAuthnAuthenticateEventHandler({
  // Optionally, we can prefetch the credentials if the user gives their userName during login
  async allowCredentials(event, userName) {
    const db = await getDatabaseConnection()

    const username = makeUsername(userName)

    // Find user by email
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('userName', '=', username)
      .executeTakeFirst()

    // If no user is found, the authentication cannot be completed
    if (!user)
      throw createError({ statusCode: 400, message: 'User not found' })

    // Find credentials for the user
    const credentials = await db
      .selectFrom('webauthnCredentials')
      .select(['credentialId', 'transports'])
      .where('userId', '=', user.id)
      .execute()

    // If no credentials are found, the authentication cannot be completed
    if (!credentials.length)
      throw createError({ statusCode: 400, message: 'No credentials found for this user' })

    // Return credentials in the format expected by WebAuthn API
    return credentials.map(credential => ({
      id: credential.credentialId,
      transports: credential.transports ? JSON.parse(credential.transports) : undefined,
    }))
  },
  async getCredential(event, credentialId) {
    const db = await getDatabaseConnection()

    // Look for the credential in our database
    const credential = await db
      .selectFrom('webauthnCredentials')
      .innerJoin('users', 'users.id', 'webauthnCredentials.userId')
      .select([
        'webauthnCredentials.id as id',
        'webauthnCredentials.userId as userId',
        'webauthnCredentials.credentialId',
        'webauthnCredentials.publicKey',
        'webauthnCredentials.counter',
        'webauthnCredentials.backedUp',
        'webauthnCredentials.transports',
        'users.email',
      ])
      .where('webauthnCredentials.credentialId', '=', credentialId)
      .executeTakeFirst()

    // If the credential is not found, there is no account to log in to
    if (!credential)
      throw createError({ statusCode: 400, message: 'Credential not found' })

    return {
      id: credential.credentialId,
      publicKey: credential.publicKey,
      counter: credential.counter,
      userId: credential.userId,
      userName: credential.email,
      backedUp: credential.backedUp,
    }
  },
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
  async onSuccess(event, { credential, authenticationInfo }) {
    // The credential authentication has been successful
    // We can look it up in our database and get the corresponding user
    const db = await getDatabaseConnection()

    const userCredential = await db
      .selectFrom('webauthnCredentials')
      .innerJoin('users', 'users.id', 'webauthnCredentials.userId')
      .select([
        'webauthnCredentials.id as credentialId',
        'webauthnCredentials.userId',
        'users.id',
        'users.name',
        'users.userName',
        'users.email',
        'users.googleId',
      ])
      .where('webauthnCredentials.credentialId', '=', credential.id)
      .executeTakeFirst()

    if (!userCredential)
      throw createError({ statusCode: 400, message: 'User not found' })

    // Update the counter in the database with authenticationInfo.newCounter
    await db
      .updateTable('webauthnCredentials')
      .set({ counter: authenticationInfo.newCounter })
      .where('credentialId', '=', credential.id)
      .execute()

    // Set the user session
    await setUserSession(event, {
      user: {
        id: userCredential.id,
        name: userCredential.name,
        userName: userCredential.userName,
        email: userCredential.email,
        googleId: userCredential.googleId,
      },
    })
  },
})
