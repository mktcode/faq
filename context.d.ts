declare module 'h3' {
  interface H3EventContext {
    profile: {
      username: string | null
      isSubscribed: boolean
      isOwned: boolean
      isPublic: boolean
      design: string
    } | undefined
  }
}

export {}
