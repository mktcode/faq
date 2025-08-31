export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userid')
  const confirmationToken = getRouterParam(event, 'token')
  const subscription = getRouterParam(event, 'subscription') as 'S' | 'L' | undefined

  if (!userId || !confirmationToken || !subscription || !['S', 'L'].includes(subscription)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Invalid parameters',
    })
  }

  const db = await getDatabaseConnection()

  const user = await db
    .selectFrom('users')
    .select(['id', 'userName', 'email', 'stripeCustomerId', 'lastPaidAt'])
    .where('id', '=', Number(userId))
    .where('emailConfirmationToken', '=', confirmationToken)
    .executeTakeFirst()

  if (user && user.email) {
    await db
      .updateTable('users')
      .set({ emailConfirmationToken: null })
      .where('id', '=', user.id)
      .execute()

    stripe.requireNoPriorSubscription(user.lastPaidAt)
    stripe.requireNoStripeCustomerId(user.stripeCustomerId)

    const settings = await getSettings(user.id)

    const stripeCustomerId = await stripe.requireCompleteStripeCustomer(
      user.id,
      user.email,
      settings,
    )

    const checkoutSession = await stripe.createCheckoutSession(stripeCustomerId, user.userName, subscription)

    if (checkoutSession.url) {
      return sendRedirect(event, checkoutSession.url, 302)
    }

    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Failed to create checkout session',
    })
  }
})
