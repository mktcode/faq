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
    .select(['domainContactId'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  // TODO: improve this check and make sure external domains can still be changed
  if (currentDomainInfo.domainContactId) {
    throw createError({ statusCode: 409, statusMessage: 'Domain already registered' })
  }

  await requireDomainAvailability(domain)

  const settings = await getPublicSettings(user.id)
  const domainContactId = await autodns.createDomainContact({
    // TODO: set first and lastname correctly
    firstname: settings.company.name,
    lastname: settings.company.name,
    street: settings.company.street,
    city: settings.company.city,
    postalCode: settings.company.zip,
    country: 'DE',
  })
  await db.updateTable('users').set({ domainContactId }).where('id', '=', user.id).execute()

  await autodns.registerDomainWithZone(domain, domainContactId)
  // TODO: surely we need to wait a bit here
  await hetzner.addNewCertToLoadBalancer(domain)

  await db
    .updateTable('users')
    .set({ domain, domainIsExternal: false })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
