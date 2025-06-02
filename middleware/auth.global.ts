export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession()
  const publicPaths = ['/login', '/', '/datenschutz', '/impressum', '/register']

  if (!loggedIn.value && !publicPaths.includes(to.path)) {
    return navigateTo('/login')
  }
})
