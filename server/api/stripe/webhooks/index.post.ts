import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
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

    await db.updateTable('payments')
      .set({
        status: 'succeeded',
        transactionId: paymentIntent.client_secret,
      })
      .where('transactionId', '=', paymentIntent.client_secret)
      .execute()

    await updateUserBalance(Number(paymentIntent.metadata.userId))
  }

  return {
    success: true,
    error: null,
  }
})
