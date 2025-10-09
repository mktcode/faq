import type { SettingsForm } from '~~/types/db'
import Stripe from 'stripe'

declare module 'h3' {
  interface H3EventContext {
    profile: {
      id: number
      username: string
      subscription: {
        plan: 'S' | 'L' | null
        paid: boolean
      }
      isOwned: boolean
      isAdmin: boolean
      isPublic: boolean
      design: string
      settings: SettingsForm
      originalSettings: SettingsForm
      canonicalUrl: string
      canonicalUri: string
      domain: string | null
      domainIsExternal: boolean
      mailboxes: string[]
    } | undefined
  }
}

export {}
