export default defineEventHandler(({ req, context }) => {
  const { public: { appHost } } = useRuntimeConfig()

  console.log('Host:', req.headers.host, appHost)
  const hasSubdomain = !(req.headers.host || appHost).startsWith(appHost)
  console.log('Has subdomain:', hasSubdomain)

  if (hasSubdomain) {
    const subdomain = (req.headers.host || appHost).split('.')[0]
    context.subdomain = subdomain
  }
})
