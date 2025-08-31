import type { SettingsForm } from './types/db'

type Profile = {
  username: string
  isOwned: boolean
  isPublic: boolean
  subscription: {
    checkoutPending: boolean
    plan: 'S' | 'L' | null
    paid: boolean
  }
  settings: SettingsForm
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
