import type { SettingsForm } from './types/db'

type Profile = {
  username: string
  isOwned: boolean
  isPublic: boolean
  isSubscribed: boolean
  settings: SettingsForm
  canonicalUrl: string
  domain: string | null
  domainIsExternal: boolean
  mailboxes: string[]
}

type AdminState = {
  showMainSettings: boolean
  showCompanySettings: boolean
  showDomainSettings: boolean
  showEmailSettings: boolean
  showSubscriptionSettings: boolean
  showWebsiteSettings: boolean
  showDesignSettings: boolean
  showOfferingSettings: boolean
  showAssistant: boolean
}

declare module '#app' {
  interface NuxtApp {
    $profile: Profile
    $admin: AdminState
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $profile: Profile
    $admin: AdminState
  }
}

export {}
