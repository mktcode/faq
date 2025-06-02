export default defineNuxtRouteMiddleware(async () => {
  const { user } = useUserSession()

  if (user.value?.id !== 1) {
    return navigateTo('/login')
  }
})
