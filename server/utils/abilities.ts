import type { User } from '#auth-utils'

export const isAdmin = defineAbility(async (user: User) => {
  return user.id === 1
})
