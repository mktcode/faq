export default defineEventHandler(({ req, context }) => {
  const { host } = useRuntimeConfig()

  const hasSubdomain = !(req.headers.host || host).startsWith(host)

  if (hasSubdomain) {
    const subdomain = (req.headers.host || host).split('.')[0]
    context.subdomain = subdomain
  }
})
