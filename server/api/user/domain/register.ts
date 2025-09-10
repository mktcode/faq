import { z } from 'zod'

// allow only .de domains
const bodySchema = z.object({
  // TODO: improve domain validation
  domain: z.string().regex(/^[a-z0-9-]{1,63}\.de$/, 'Invalid domain'),
})

const createCertWhenDomainReady = async (domain: string, retryCount: number = 0) => {
  if (retryCount >= 20) { // Stop after 5 minutes (20 * 15s)
    console.log(`Max retries reached for ${domain}. Giving up.`);
    return;
  }

  console.log(`Checking domain status for ${domain}...`);

  const { info, error } = await autodns.domainInfo(domain);

  // Stop when there is an error
  if (error) {
    console.error('Error fetching domain info:', error);
    return
  }

  if (info && info.status === 200) {
    await hetzner.addNewCertToLoadBalancer(domain)
  } else {
    setTimeout(() => createCertWhenDomainReady(domain, retryCount + 1), 15_000);
  }
};

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { domain } = await readValidatedBody(event, body => bodySchema.parse(body))

  const settings = await getPublicSettings(user.id)

  const currentDomainInfo = await db
    .selectFrom('users')
    .select(['domain', 'domainContactId'])
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow()

  if (currentDomainInfo.domain) {
    throw createError({ statusCode: 409, statusMessage: 'A domain is already connected.' })
  }

  await requireDomainAvailability(domain)

  if (!currentDomainInfo.domainContactId) {
    const { domainContactId, error } = await autodns.createDomainContact({
      orgName: settings.company.name,
      firstname: settings.company.firstname,
      lastname: settings.company.lastname,
      street: settings.company.street,
      city: settings.company.city,
      postalCode: settings.company.zip,
      country: 'DE',
      email: settings.company.email,
      phone: settings.company.phone,
    })
    await db.updateTable('users').set({ domainContactId }).where('id', '=', user.id).execute()
    currentDomainInfo.domainContactId = domainContactId

    if (error) {
      return { error }
    }
  }

  if (currentDomainInfo.domainContactId) {
    const { error } = await autodns.registerDomainWithZone(domain, currentDomainInfo.domainContactId)

    if (error) {
      return { error }
    }
  }

  await db
    .updateTable('users')
    .set({ domain, domainIsExternal: false })
    .where('id', '=', user.id)
    .execute()

  event.waitUntil(createCertWhenDomainReady(domain));
  
  return { error: null }
})
