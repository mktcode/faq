import Handlebars from "handlebars";
import { parse } from 'yaml'

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const db = await getDatabaseConnection()

  const website = await db.selectFrom('websites')
    .selectAll()
    .where('userId', '=', $profile.id)
    .limit(1)
    .executeTakeFirstOrThrow()

  const partials = await db.selectFrom('websitePartials')
    .selectAll()
    .where('websiteId', '=', website.id)
    .execute()

  const page = await db.selectFrom('websitePages')
    .selectAll()
    .where('websiteId', '=', website.id)
    .executeTakeFirstOrThrow()

  const data = parse(website.store || '{}')

  partials.forEach(partial => {
    Handlebars.registerPartial(partial.name, partial.template)
  })

  const globalCss = website.css || ''
  const globalJs = ''

  const htmlHead = `<head>
  <meta charset="UTF-8">
  <style>${globalCss}</style>
  <script src="//unpkg.com/alpinejs" defer></script>
  <script>${globalJs}</script>
</head>`

  const pageTemplate = Handlebars.compile(page.template)
  const htmlBody = `<body>${pageTemplate(data)}</body>`

  const html = `<!DOCTYPE html><html>${htmlHead}${htmlBody}</html>`

  event.node.res.setHeader('Content-Type', 'text/html')
  event.node.res.end(html)
})
