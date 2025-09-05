export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  if (!me.stripeCustomerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User has no Stripe customer ID',
    })
  }

  if (!me.stripeSubscriptionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User has no active subscription',
    })
  }

  const switchSession = await stripe.createPortalSwitchSubscriptionSession(me.stripeCustomerId, me.stripeSubscriptionId, me.userName)

  return switchSession
})
