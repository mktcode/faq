import Stripe from 'stripe'
import type { SettingsForm } from '~~/types/db'

export type HasEmailFields<TUser> = TUser & {
  email: string | null
  emailConfirmationToken: string | null
}

export type UserWithVerifiedEmail<TUser> = TUser & {
  email: string
  emailConfirmationToken: null
}

async function requireCompleteStripeCustomer(
  userId: number,
  email: string,
  settings: SettingsForm,
): Promise<string> {
  const db = await getDatabaseConnection()
  const { stripeApiSecretKey } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  const stripeCustomerData: Stripe.CustomerCreateParams = {
    name: settings.public.company.name,
    address: {
      city: settings.public.company.city,
      line1: settings.public.company.street,
      country: 'DE',
      postal_code: settings.public.company.zip,
    },
    metadata: {
      solohostUserId: userId.toString(),
    },
    tax: {
      validate_location: 'immediately' as const,
    },
  }

  const customers = await stripe.customers.list({ email })

  const existingCustomerByUserId = customers.data.find(c => c.metadata.solohostUserId === userId.toString())
  const existingCustomerByOldest = customers.data.sort((a, b) => a.created - b.created)[0]

  const foundCustomer = existingCustomerByUserId || existingCustomerByOldest

  let finalCustomerId = null

  if (foundCustomer) {
    await stripe.customers.update(foundCustomer.id, stripeCustomerData)
    finalCustomerId = foundCustomer.id
  }
  else {
    const newStripeCustomer = await stripe.customers.create({ email, ...stripeCustomerData })
    finalCustomerId = newStripeCustomer.id
  }

  await db
    .updateTable('users')
    .set({ stripeCustomerId: finalCustomerId })
    .where('id', '=', userId)
    .execute()

  return finalCustomerId
}

async function createCheckoutSession(customerId: string, subscription: 'S' | 'L') {
  const { stripeApiSecretKey, stripePriceSId, stripePriceLId, public: { appHost } } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  const priceId = subscription === 'S' ? stripePriceSId : stripePriceLId

  return await stripe.checkout.sessions.create({
    customer: customerId,
    success_url: `https://${appHost}/danke`,

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    mode: 'subscription',
  })
}

function returnUrl(userName: string) {
  const { public: { appHost } } = useRuntimeConfig()
  return `https://${userName}.${appHost}/#settings/subscription`
}

async function createPortalSession(customerId: string, userName: string) {
  const { stripeApiSecretKey } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl(userName),
  })
}

async function createPortalCancelSubscriptionSession(customerId: string, subscriptionId: string, userName: string) {
  const { stripeApiSecretKey } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl(userName),
    flow_data: {
      type: 'subscription_cancel',
      subscription_cancel: {
        subscription: subscriptionId,
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          return_url: returnUrl(userName),
        },
      },
    },
  })
}

async function getCheckoutSession(sessionId: string) {
  const { stripeApiSecretKey } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  return await stripe.checkout.sessions.retrieve(sessionId)
}

function requireNoPriorSubscription(lastPaidAt: Date | null): void {
  if (lastPaidAt !== null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User has an active subscription',
    })
  }
}

function requireNoStripeCustomerId(stripeCustomerId: string | null): void {
  if (stripeCustomerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User already has a Stripe customer ID',
    })
  }
}

export const stripe = {
  requireCompleteStripeCustomer,
  createCheckoutSession,
  getCheckoutSession,
  createPortalSession,
  createPortalCancelSubscriptionSession,
  requireNoPriorSubscription,
  requireNoStripeCustomerId,
}
