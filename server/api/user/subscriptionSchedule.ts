import Stripe from "stripe"

export default defineEventHandler(async (event) => {
  const user = await requireMe(event)

  let subscription: Stripe.Subscription | null = null
  let schedule: Stripe.SubscriptionSchedule | null = null

  if (user.stripeSubscriptionId) {
    try {
      const subSchedule = await stripe.getSubscriptionSchedule(user.stripeSubscriptionId)
      subscription = subSchedule.subscription
      schedule = subSchedule.schedule
    } catch (error) {
      console.error('Failed to retrieve Stripe subscription schedule:', error)
    }
  }

  return { subscription, schedule }
})
