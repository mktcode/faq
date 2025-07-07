import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { stripeApiSecretKey, public: { appHost } } = useRuntimeConfig()

  const userInDb = await db
    .selectFrom('users')
    .select(['id', 'stripeCustomerId', 'userName'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  if (!userInDb.stripeCustomerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User does not have a Stripe customer ID',
    })
  }

  const stripe = new Stripe(stripeApiSecretKey)

  const session = await stripe.checkout.sessions.create({
    customer: userInDb.stripeCustomerId,
    success_url: `https://${userInDb.userName}.${appHost}?paymentSuccess=1`,
    line_items: [
      {
        price: 'price_1Ri8oZCxuwKUITGBTgjOnmSj', // TODO: make env var
        quantity: 1,
      },
    ],
    mode: 'subscription',
  })

  return { success: true, url: session.url }
})
