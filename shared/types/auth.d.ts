declare module '#auth-utils' {
  interface User {
    id: number
    credentialId: string
    name: string
    userName: string
    email: string | null
    picture: string
    emailConfirmationToken: string | null
    editSettingsId: number
  }

  interface SecureSessionData {
    token: string
  }
}

export {}
