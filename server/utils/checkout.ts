import Stripe from 'stripe'
import type { SettingsForm } from '~/types/db'

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

async function createCheckoutSession(customerId: string, userName: string) {
  const { stripeApiSecretKey, stripePriceSId, public: { appHost } } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  return await stripe.checkout.sessions.create({
    customer: customerId,
    success_url: `https://${userName}.${appHost}?subscriptionSuccess=1`,

    line_items: [
      {
        price: stripePriceSId,
        quantity: 1,
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    mode: 'subscription',
  })
}

function requireNoSubscription(lastPaidAt: Date | null): void {
  if (checkSubscriptionStatus(lastPaidAt)) {
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
  requireNoSubscription,
  requireNoStripeCustomerId
}