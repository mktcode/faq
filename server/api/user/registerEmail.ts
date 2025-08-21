import { z } from 'zod'

/**
 * if not already done:
 * - create domain for mailboxes (qboxmail)
 * - add A record for domain id as subdomain (autodns)
 * - add MX records (autodns)
 * 
 * then:
 * - create mailbox (qboxmail)
 */

// allow only .de domains
const bodySchema = z.object({
  mailbox: z.string().regex(/\.de$/, 'Invalid domain'),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { domain } = await readValidatedBody(event, body => bodySchema.parse(body))

  const domainAvailability = await checkDomainAvailability(domain)

  if (!domainAvailability.available) {
    throw createError({ statusCode: 409, statusMessage: 'Domain not available' })
  }

  // const id = await registerDomain(domain)

  await db
    .updateTable('users')
    .set({ domain, domainIsExternal: false })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
