export default defineEventHandler(({ req, context }) => {
  const { public: { host } } = useRuntimeConfig()

  console.log('Host:', req.headers.host, host)
  const hasSubdomain = !(req.headers.host || host).startsWith(host)
  console.log('Has subdomain:', hasSubdomain)

  if (hasSubdomain) {
    const subdomain = (req.headers.host || host).split('.')[0]
    context.subdomain = subdomain
  }
})
