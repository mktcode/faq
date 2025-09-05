export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  if (!me.stripeCustomerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User has no Stripe customer ID',
    })
  }

  const portalSession = await stripe.createCustomerPortalSession(me.stripeCustomerId, me.userName)

  return portalSession
})
