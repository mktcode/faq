import type { SettingsForm } from '~~/types/db'
import Stripe from 'stripe'

type Profile = {
  username: string
  isOwned: boolean
  isPublic: boolean
  subscription: {
    plan: 'S' | 'L' | null
    paid: boolean
  }
  settings: SettingsForm
  originalSettings: SettingsForm
  canonicalUrl: string
  domain: string | null
  domainIsExternal: boolean
  mailboxes: string[]
}

declare module '#app' {
  interface NuxtApp {
    $profile: Profile
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $profile: Profile
  }
}

export {}
