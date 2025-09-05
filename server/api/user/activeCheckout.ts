import Stripe from "stripe"

export default defineEventHandler(async (event) => {
  const user = await requireMe(event)
  
  let checkoutSession: Stripe.Checkout.Session | null = null

  if (user.stripeCheckoutSessionId) {
    try {
      checkoutSession = await stripe.getCheckoutSession(user.stripeCheckoutSessionId)
    } catch (error) {
      console.error('Failed to retrieve Stripe checkout session:', error)
    }
  }

  return checkoutSession
})
