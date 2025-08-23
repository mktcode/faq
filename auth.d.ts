declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    userName: string
    email: string | null
    picture: string
    emailConfirmationToken: string | null
  }

  interface SecureSessionData {
    token: string
  }
}

export {}
