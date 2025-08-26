export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain')
  
  const currentHost = router.getCurrentHost(event)
  const user = await router.getUserFromHost(currentHost)

  if (user) {
    if (user.published) {
        return `User-agent: *
Allow: /`
    } else {
      return `User-agent: *
Disallow: /`
    }
  }

  return `User-agent: *
Disallow: /`
})
