import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const { stripeApiSecretKey, public: { appHost } } = useRuntimeConfig()

  const confirmationToken = getQuery(event).confirmEmailToken as string | undefined

  if (confirmationToken) {
    const db = await getDatabaseConnection()

    const user = await db
      .selectFrom('users')
      .select(['id', 'userName', 'email'])
      .where('emailConfirmationToken', '=', confirmationToken)
      .executeTakeFirst()

    if (user) {
      const stripe = new Stripe(stripeApiSecretKey)
      const stripeCustomer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          userId: user.id.toString(),
        },
      })

      await db
        .updateTable('users')
        .set({
          emailConfirmationToken: null,
          stripeCustomerId: stripeCustomer.id,
        })
        .where('id', '=', user.id)
        .execute()

      return sendRedirect(event, `https://${user.userName}.${appHost}?emailVerified=1`, 302)
    }
  }
})
