import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { stripeApiSecretKey, stripePriceId, public: { appHost } } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  let stripeCustomerId = null

  const userInDb = await db
    .selectFrom('users')
    .select(['id', 'stripeCustomerId', 'userName', 'email', 'emailConfirmationToken'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  if (!userInDb.email || userInDb.emailConfirmationToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User does not have a verified email address',
    })
  }

  stripeCustomerId = userInDb.stripeCustomerId

  if (!stripeCustomerId) {
    const customers = await stripe.customers.list({
      email: userInDb.email,
    })

    const existingCustomerByUserId = customers.data.find(c => c.metadata.solihostUserId === userInDb.id.toString())
    const existingCustomerByOldest = customers.data.sort((a, b) => a.created - b.created)[0]

    if (existingCustomerByUserId) {
      stripeCustomerId = existingCustomerByUserId.id
    } else if (existingCustomerByOldest) {
      stripeCustomerId = existingCustomerByOldest.id
      await stripe.customers.update(stripeCustomerId, {
        metadata: {
          ...existingCustomerByOldest.metadata,
          solihostUserId: userInDb.id.toString(),
        },
      })
    } else {
      const stripeCustomer = await stripe.customers.create({
        email: userInDb.email,
        metadata: {
          solihostUserId: userInDb.id.toString(),
        },
      })
      
      stripeCustomerId = stripeCustomer.id
    }

    await db
      .updateTable('users')
      .set({ stripeCustomerId })
      .where('id', '=', userInDb.id)
      .execute()
  }

  if (!stripeCustomerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User does not have a Stripe customer ID and it could not be created on the fly.',
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    success_url: `https://${userInDb.userName}.${appHost}?subscriptionSuccess=1`,
    
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    mode: 'subscription',
  })

  return { success: true, url: session.url }
})
