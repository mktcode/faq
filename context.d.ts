import type { SettingsForm } from '~/types/db';

declare module 'h3' {
  interface H3EventContext {
    profile: {
      username: string
      isSubscribed: boolean
      isOwned: boolean
      isPublic: boolean
      design: string
      settings: SettingsForm
      canonicalUrl: string
      domain: string | null
      domainIsExternal: boolean
      mailboxes: string[]
    } | undefined
  }
}

export {}
