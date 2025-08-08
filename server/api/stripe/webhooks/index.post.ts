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

  // TODO: Need to differentiate between those events and restrict e.g. domain registration until payment is confirmed
  if (stripeEvent.type === 'invoice.paid' || stripeEvent.type === 'customer.subscription.created') {
    const paidInvoiceOrCreatedSubscription = stripeEvent.data.object
    const customerId = paidInvoiceOrCreatedSubscription.customer as string
    const timestamp = new Date(paidInvoiceOrCreatedSubscription.created * 1000)

    const db = await getDatabaseConnection()
    await db
      .updateTable('users')
      .set({
        lastPaidAt: timestamp,
      })
      .where('stripeCustomerId', '=', customerId)
      .execute()
  }

  return {
    success: true,
    error: null,
  }
})
