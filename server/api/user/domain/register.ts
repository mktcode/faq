import { z } from 'zod'

const onlyDeDomainSchema = z.string().regex(/^[a-z0-9-]{1,63}\.de$/, 'Invalid domain')
const bodySchema = z.object({
  domain: onlyDeDomainSchema,
  mailboxes: z.array(z.string()),
})

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  if (me.domain) {
    throw createError({ statusCode: 409, statusMessage: 'A domain is already set.' })
  }

  if (!me.chatwootSourceId) {
    throw createError({ statusCode: 400, statusMessage: 'No chatwoot source ID set' })
  }

  const db = await getDatabaseConnection()
  const { domain, mailboxes } = await readValidatedBody(event, body => bodySchema.parse(body))

  await domainUtils.requireAvailability(domain)

  await db
    .updateTable('users')
    .set({ domain, domainIsExternal: false, mailboxes: JSON.stringify(mailboxes) })
    .where('id', '=', me.id)
    .execute()

  const supportMessage = `Domainregistrierung: ${domain}\nPostfächer:\n${mailboxes.length ? mailboxes.map(mb => `- ${mb}`).join('\n') : 'keine'}`

  await chatwoot.startConversation(me.chatwootSourceId, supportMessage)

  setResponseStatus(event, 204)
})
