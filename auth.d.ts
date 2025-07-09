declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    userName: string
    email: string | null
    picture: string
  }

  interface SecureSessionData {
    token: string
  }
}

export {}
