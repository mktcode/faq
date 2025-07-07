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

  if (stripeEvent.type === 'invoice.paid') {
    const paidInvoice = stripeEvent.data.object
    const customerId = paidInvoice.customer as string

    const db = await getDatabaseConnection()
    await db
      .updateTable('users')
      .set({
        lastPaidAt: new Date(),
      })
      .where('stripeCustomerId', '=', customerId)
      .execute()
  }

  return {
    success: true,
    error: null,
  }
})
