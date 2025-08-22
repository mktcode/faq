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

const bodySchema = z.object({
  mailbox: z.string().regex(/^[a-zA-Z0-9-_.]+$/, 'Invalid mailbox name'),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { mailbox } = await readValidatedBody(event, body => bodySchema.parse(body))

  const domainInfo = await db
    .selectFrom('users')
    .select(['domain'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  if (!domainInfo.domain) {
    throw new Error('User has no domain.')
  }

  const { id, subdomainVerifyIp } = await qboxmail.createDomainIfNotExists(domainInfo.domain)

  await autodns.addMissingMailRecords(domainInfo.domain, id, subdomainVerifyIp)

  const settings = await getPublicSettings(user.id)
  await qboxmail.createMailbox(mailbox, domainInfo.domain, settings.company.name)

  return { success: true }
})
