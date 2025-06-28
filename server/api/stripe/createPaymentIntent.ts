import { z } from 'zod'
import Stripe from 'stripe'

const inputSchema = z.object({
  amount: z.number().positive(),
})

export default defineEventHandler(async (event) => {
  const { amount } = await readValidatedBody(event, body => inputSchema.parse(body))
  const db = await getDatabaseConnection()
  const { user } = await requireUserSession(event)

  // existing payment
  const existingPayment = await db.selectFrom('payments')
    .selectAll()
    .where('userId', '=', user.id)
    .where('status', '=', 'pending')
    .executeTakeFirst()

  if (existingPayment) {
    return existingPayment.transactionId
  }

  const { stripeApiSecretKey } = useRuntimeConfig()

  const stripe = new Stripe(stripeApiSecretKey)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe requires the amount in cents
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      userId: user.id,
    },
  })

  await db.insertInto('payments').values({
    amount,
    userId: user.id,
    paymentMethod: 'stripe',
    transactionId: paymentIntent.client_secret,
  }).execute()

  return paymentIntent.client_secret
})
