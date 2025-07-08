declare module 'h3' {
  interface H3EventContext {
    profile: null | {
      username: string
      isSubscribed: boolean
      design: string
    }
  }
}

export {}
