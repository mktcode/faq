import { z } from 'zod'

/**
 * if not already done:
 * - create domain contact
 * 
 * then:
 * - register the domain (autodns)
 * - set A record to app/lb ip (autodns)
 * - create certificate for lb (hetzner)
 */

// allow only .de domains
const bodySchema = z.object({
  domain: z.string().regex(/\.de$/, 'Invalid domain'),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { domain } = await readValidatedBody(event, body => bodySchema.parse(body))

  const currentDomainInfo = await db
    .selectFrom('users')
    .select(['domain', 'domainIsExternal'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  if (currentDomainInfo.domain && !currentDomainInfo.domainIsExternal) {
    throw createError({ statusCode: 409, statusMessage: 'Domain already registered' })
  }

  const domainAvailability = await checkDomainAvailability(domain)

  if (!domainAvailability.available) {
    throw createError({ statusCode: 409, statusMessage: 'Domain not available' })
  }

  const domainContactId = await autodns.findOrCreateDomainContact('kontakt@emmaherbst.de')
  const domainId = await autodns.registerDomain(domain, domainContactId)
  await hetzner.addNewCertToLoadBalancer(domain)

  await db
    .updateTable('users')
    .set({ domain, domainIsExternal: false })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
