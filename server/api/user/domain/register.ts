import { z } from 'zod'

// allow only .de domains
const bodySchema = z.object({
  // TODO: improve domain validation
  domain: z.string().regex(/^[a-z0-9-]{1,63}\.de$/, 'Invalid domain'),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { domain } = await readValidatedBody(event, body => bodySchema.parse(body))

  const currentDomainInfo = await db
    .selectFrom('users')
    .select(['domain', 'domainContactId'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  if (currentDomainInfo.domain) {
    throw createError({ statusCode: 409, statusMessage: 'A domain is already set.' })
  }

  await requireDomainAvailability(domain)

  await db
    .updateTable('users')
    .set({ domain, domainIsExternal: false })
    .where('id', '=', user.id)
    .execute()
  
  setResponseStatus(event, 204)
})
