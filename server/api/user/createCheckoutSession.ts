import { settingsFormSchema } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const userInDb = await db
    .selectFrom('users')
    .select(['id', 'stripeCustomerId', 'userName', 'email', 'emailConfirmationToken', 'settings', 'lastPaidAt'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  requireNoSubscription(userInDb.lastPaidAt)
  requireNoStripeCustomerId(userInDb.stripeCustomerId)

  const userWithVerifiedEmail = stripe.requireVerifiedEmail(userInDb)

  const settings = settingsFormSchema.parse(
    typeof userWithVerifiedEmail.settings === 'string' ? JSON.parse(userWithVerifiedEmail.settings) : userWithVerifiedEmail.settings,
  )

  const stripeCustomerId = await stripe.requireCompleteStripeCustomer(
    userWithVerifiedEmail.id,
    userWithVerifiedEmail.email,
    settings,
  )

  const checkoutSession = await stripe.createCheckoutSession(stripeCustomerId, userWithVerifiedEmail.userName)

  return { success: true, url: checkoutSession.url }
})
