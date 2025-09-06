import Stripe from "stripe"

export default defineEventHandler(async (event) => {
  const user = await requireMe(event)

  let schedule: Stripe.SubscriptionSchedule | null = null

  if (user.stripeSubscriptionId) {
    try {
      schedule = await stripe.getSubscriptionSchedule(user.stripeSubscriptionId)
    } catch (error) {
      console.error('Failed to retrieve Stripe subscription schedule:', error)
    }
  }

  return schedule
})
