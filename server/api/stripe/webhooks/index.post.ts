import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const { stripeApiSecretKey, stripeWebhookSecret, stripePriceSId, stripePriceLId } = useRuntimeConfig()

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

  // TODO: [CRITICAL] Restrict e.g. domain registration until payment is confirmed (invoice.paid)

  if (stripeEvent.type === 'customer.subscription.created') {
    const createdSubscription = stripeEvent.data.object
    const customerId = createdSubscription.customer as string
    
    const priceId = createdSubscription.items.data[0].price.id
    console.log('subscription created for price:', priceId)

    const db = await getDatabaseConnection()
    await db
      .updateTable('users')
      .set({
        stripeCheckoutSessionId: null,
        subscription: priceId === stripePriceSId ? 'S' : priceId === stripePriceLId ? 'L' : null,
      })
      .where('stripeCustomerId', '=', customerId)
      .execute()
  }

  if (stripeEvent.type === 'invoice.paid') {
    const paidInvoice = stripeEvent.data.object
    const customerId = paidInvoice.customer as string
    const timestamp = new Date(paidInvoice.created * 1000)
    
    const priceId = paidInvoice.lines.data[0].pricing?.price_details?.price
    console.log('invoice paid for price:', priceId)

    const db = await getDatabaseConnection()
    await db
      .updateTable('users')
      .set({
        lastPaidAt: timestamp,
        subscription: priceId === stripePriceSId ? 'S' : priceId === stripePriceLId ? 'L' : null,
      })
      .where('stripeCustomerId', '=', customerId)
      .execute()
  }

  return {
    success: true,
    error: null,
  }
})
