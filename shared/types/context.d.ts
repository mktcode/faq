import type { SettingsForm } from '~~/types/db'
import Stripe from 'stripe'

declare module 'h3' {
  interface H3EventContext {
    profile: {
      username: string
      subscription: {
        checkoutSession: Stripe.Checkout.Session | null
        plan: 'S' | 'L' | null
        paid: boolean
      }
      isOwned: boolean
      isPublic: boolean
      design: string
      settings: SettingsForm
      canonicalUrl: string
      canonicalUri: string
      domain: string | null
      domainIsExternal: boolean
      mailboxes: string[]
    } | undefined
  }
}

export {}
