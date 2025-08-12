import { z } from 'zod'

// allow only .de domains
const bodySchema = z.object({
  domain: z.string().regex(/\.de$/, 'Invalid domain'),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const { domain } = await readValidatedBody(event, body => bodySchema.parse(body))

  const domainAvailability = await checkDomainAvailability(domain)

  return { isAvailable: domainAvailability.available }
})
