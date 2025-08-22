import { SettingsForm } from "./types/db"

type Admin = {
  username: string
  isPublic: boolean
  isSubscribed: boolean
  settings: SettingsForm
}

type Profile = {
  username: string
  isOwned: boolean
  isPublic: boolean
  isSubscribed: boolean
  settings: SettingsForm['public']
  canonicalUrl: string
}

declare module '#app' {
  interface NuxtApp {
    $admin: Admin
    $profile: Profile
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $admin: Admin
    $profile: Profile
  }
}

export {}