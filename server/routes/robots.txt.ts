export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain')

  if (event.context.profile) {
    return `User-agent: *
Allow: /

Sitemap: ${event.context.profile.canonicalUri}/sitemap.xml`
  }

  const { appHost } = useRuntimeConfig().public

  return `User-agent: *
Allow: /

Sitemap: https://${appHost}/sitemap.xml`
})
