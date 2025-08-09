import Stripe from "stripe"
import { SettingsForm } from "~/types/db"

export type HasEmailFields<TUser> = TUser & {
  email: string | null
  emailConfirmationToken: string | null
}

export type UserWithVerifiedEmail<TUser> = TUser & {
  email: string
  emailConfirmationToken: null
}

export function requireVerifiedEmail<TUser>(
  user: HasEmailFields<TUser>,
): UserWithVerifiedEmail<TUser> {
  if (user.email && user.emailConfirmationToken === null) {
    return user as UserWithVerifiedEmail<TUser>
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Bad Request: User does not have a verified email address',
  })
}

export async function requireCompleteStripeCustomer(
  userId: number,
  email: string,
  settings: SettingsForm
): Promise<string> {
  const db = await getDatabaseConnection()
  const { stripeApiSecretKey } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  const stripeCustomerData = {
    name: settings.company.name,
    address: {
      city: settings.company.city,
      country: 'DE',
      postal_code: settings.company.zip,
    },
    metadata: {
      solihostUserId: userId.toString(),
    },
    tax: {
      validate_location: 'immediately' as const
    }
  }

  const customers = await stripe.customers.list({ email })

  const existingCustomerByUserId = customers.data.find(c => c.metadata.solihostUserId === userId.toString())
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

export async function createCheckoutSession(customerId: string, userName: string) {
  const { stripeApiSecretKey, stripePriceId, public: { appHost } } = useRuntimeConfig()
  const stripe = new Stripe(stripeApiSecretKey)

  return await stripe.checkout.sessions.create({
    customer: customerId,
    success_url: `https://${userName}.${appHost}?subscriptionSuccess=1`,

    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    mode: 'subscription',
  })
}

export function requireNoSubscription(lastPaidAt: Date | null): void {
  if (checkSubscriptionStatus(lastPaidAt)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User has an active subscription',
    })
  }
}

export function requireNoStripeCustomerId(stripeCustomerId: string | null): void {
  if (stripeCustomerId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: User already has a Stripe customer ID',
    })
  }
}