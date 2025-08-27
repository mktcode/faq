export default defineEventHandler(async (event) => {
  if (import.meta.dev) {
    // TODO: Remove when fixed in Nuxt
    event.node.req.headers['x-forwarded-proto'] = 'https'
  }

  const currentHost = router.getCurrentHost(event)
  const user = await router.getUserFromHost(currentHost)

  if (user) {
    await router.setProfileContextOrRedirect(event, user)
  }
  // TODO: find more elegant way to solve the health check and docker problem
  // When docker checks the running container it will be redirected because host is the container id, not the lb ip or a real domain.
  else if (!router.isRootDomain(currentHost) && event.node.req.url !== '/up') {
    await router.redirectToRoot(event)
    return
  }
})
