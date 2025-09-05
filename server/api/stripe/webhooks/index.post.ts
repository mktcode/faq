import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const { stripeApiSecretKey, stripeWebhookSecret } = useRuntimeConfig()

  const stripeSignature = getHeader(event, 'stripe-signature')
  if (!stripeSignature) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Missing stripe signature',
    })
  }

  const rawBody = await readRawBody(event, false)

  if (!rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Missing raw body',
    })
  }

  const stripe = new Stripe(stripeApiSecretKey)
  const stripeEvent = stripe.webhooks.constructEvent(
    rawBody,
    stripeSignature,
    stripeWebhookSecret,
  )

  
  if (stripeEvent.type === 'checkout.session.completed') {
    await stripehooks.checkoutSessionCompleted(stripeEvent)
  }

  if (stripeEvent.type === 'customer.subscription.created') {
    await stripehooks.customerSubscriptionCreated(stripeEvent)
  }

  if (stripeEvent.type === 'customer.subscription.updated') {
    await stripehooks.customerSubscriptionUpdated(stripeEvent)
  }

  if (stripeEvent.type === 'customer.subscription.deleted') {
    await stripehooks.customerSubscriptionDeleted(stripeEvent)
  }
  
  return {
    success: true,
    error: null,
  }
})
