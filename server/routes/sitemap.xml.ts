type SitemapPage = {
  canonicalUrl: string,
  lastMod?: string
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

function toW3CDateString(date: string | Date): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }

  return date.toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

function getUserSitemap(pages: SitemapPage[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `<url>
    <loc>${page.canonicalUrl}</loc>
    <lastmod>${page.lastMod || new Date().toISOString()}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n  ')}
</urlset>`
}

function getRootSitemap() {
  const { appHost } = useRuntimeConfig().public

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${appHost}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://${appHost}/impressum</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://${appHost}/datenschutz</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain')

  if (event.context.profile) {
    const $profile = event.context.profile
    // TODO: update lastMod on settings or page change
    const pages: SitemapPage[] = [
      ...$profile.settings.public.pages.map(page => ({
        canonicalUrl: `${$profile.canonicalUri}${page.path}`,
        lastMod: toW3CDateString(page.lastMod),
        changeFreq: 'monthly' as const,
        priority: page.path === '/' ? 1.0 : 0.8,
      })),
      {
        canonicalUrl: `${event.context.profile.canonicalUri}/impressum`,
        lastMod: toW3CDateString(event.context.profile.settings.public.company.lastMod),
        changeFreq: 'yearly',
        priority: 0.5
      },
      {
        canonicalUrl: `${event.context.profile.canonicalUri}/datenschutz`,
        lastMod: toW3CDateString(event.context.profile.settings.public.company.lastMod),
        changeFreq: 'yearly',
        priority: 0.5
      }
    ]

    return getUserSitemap(pages)
  }

  return getRootSitemap()
})
