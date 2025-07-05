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

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object
    if (!paymentIntent.metadata.userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request: Missing userId in metadata',
      })
    }
  }

  return {
    success: true,
    error: null,
  }
})
