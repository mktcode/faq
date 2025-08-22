import { SettingsForm } from "./types/db"

type Profile = {
  username: string
  isOwned: boolean
  isPublic: boolean
  isSubscribed: boolean
  settings: SettingsForm
  canonicalUrl: string
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