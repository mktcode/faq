export default defineEventHandler(({ req, context }) => {
  const { public: { appHost } } = useRuntimeConfig()

  const hasSubdomain = !(req.headers.host || appHost).startsWith(appHost)

  if (hasSubdomain) {
    const subdomain = (req.headers.host || appHost).split('.')[0]
    context.subdomain = subdomain
  }
})
