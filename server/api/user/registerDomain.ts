import { z } from 'zod'

// allow only .de domains
const bodySchema = z.object({
  domain: z.string().regex(/\.de$/, 'Invalid domain'),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const { domain } = await readValidatedBody(event, body => bodySchema.parse(body))

  const domainAvailability = await checkDomainAvailability(domain)

  if (!domainAvailability.available) {
    throw createError({ statusCode: 409, statusMessage: 'Domain not available' })
  }

  // const id = await registerDomain(domain)

  return { success: true }
})
