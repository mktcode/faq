import type Stripe from "stripe"

async function checkoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
  const checkoutSession = event.data.object

  const db = await getDatabaseConnection()
  await db
    .updateTable('users')
    .set({
      stripeCheckoutSessionId: null,
    })
    .where('stripeCheckoutSessionId', '=', checkoutSession.id)
    .execute()
}

async function customerSubscriptionCreated(event: Stripe.CustomerSubscriptionCreatedEvent) {
  const subscription = event.data.object
  const customerId = subscription.customer as string

  const db = await getDatabaseConnection()
  await db
    .updateTable('users')
    .set({
      stripeSubscriptionId: subscription.id,
    })
    .where('stripeCustomerId', '=', customerId)
    .execute()
}

async function customerSubscriptionUpdated(event: Stripe.CustomerSubscriptionUpdatedEvent) {
  const { stripePriceSId, stripePriceLId } = useRuntimeConfig()
  const updatedSubscription = event.data.object
  const customerId = updatedSubscription.customer as string

  const priceId = updatedSubscription.items.data[0]?.price.id

  if (!priceId) {
    return {
      success: false,
      error: 'Price ID not found',
    }
  }

  const db = await getDatabaseConnection()
  await db
    .updateTable('users')
    .set({
      plan: priceId === stripePriceSId ? 'S' : priceId === stripePriceLId ? 'L' : null,
    })
    .where('stripeCustomerId', '=', customerId)
    .execute()
}

async function customerSubscriptionDeleted(event: Stripe.CustomerSubscriptionDeletedEvent) {
  const deletedSubscription = event.data.object
  const customerId = deletedSubscription.customer as string

  const db = await getDatabaseConnection()
  await db
    .updateTable('users')
    .set({
      stripeSubscriptionId: null,
      plan: null,
    })
    .where('stripeCustomerId', '=', customerId)
    .execute()
}

async function invoicePaid(event: Stripe.InvoicePaidEvent) {
  const paidInvoice = event.data.object
  const customerId = paidInvoice.customer as string
  const timestamp = new Date(paidInvoice.created * 1000)

  const db = await getDatabaseConnection()
  await db
    .updateTable('users')
    .set({
      lastPaidAt: timestamp,
    })
    .where('stripeCustomerId', '=', customerId)
    .execute()
}

export const stripehooks = {
  checkoutSessionCompleted,
  customerSubscriptionCreated,
  customerSubscriptionUpdated,
  customerSubscriptionDeleted,
  invoicePaid,
}
