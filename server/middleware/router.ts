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
  else if (!router.isRootDomain(currentHost)) {
    console.error('Redirecting to root domain from', currentHost)
    await router.redirectToRoot(event)
    return
  }
})
