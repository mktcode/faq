export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession()
  const publicPaths = ['/login', '/', '/datenschutz', '/register', '/planner']

  if (!loggedIn.value && !publicPaths.includes(to.path)) {
    return navigateTo('/login')
  }
})
