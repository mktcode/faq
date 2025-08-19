import z from 'zod'

const autodnsApiUrl = 'https://api.demo.autodns.com/v1'

export async function createDomainContact(contact: {
  firstname: string
  lastname: string
  street: string
  city: string
  postalCode: string
  country: string
  email: string
}) {
  const { autodnsApiKey } = useRuntimeConfig()
  const user = "api@markus-kottlaender.de"

  const resultSchema = z.object({
    certificate: z.object({
      id: z.number(),
    }),
  })
  type ResultType = z.infer<typeof resultSchema>

  const result = await $fetch<ResultType>(`${autodnsApiUrl}/contact`, {
    method: 'POST',
    headers: {
      'X-Domainrobot-Demo': 'true',
      'X-Domainrobot-Context': '1',
      'Authorization': `Basic ${Buffer.from(`${user}:${autodnsApiKey}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: {
      type: "PERSON",
      email: contact.email,
      fname: contact.firstname,
      lname: contact.lastname,
      address: [contact.street],
      city: contact.city,
      pcode: contact.postalCode,
      country: contact.country,
    },
  })

  return result

  // const validatedResult = resultSchema.parse(result)

  // return validatedResult.certificate.id
}

export async function findDomainContact(email: string) {
  const { autodnsApiKey } = useRuntimeConfig()
  const user = "api@markus-kottlaender.de"

  const resultSchema = z.object({
    certificate: z.object({
      id: z.number(),
    }),
  })
  type ResultType = z.infer<typeof resultSchema>

  const result = await $fetch<ResultType>(`${autodnsApiUrl}/contact/_search?keys=email`, {
    method: 'POST',
    headers: {
      'X-Domainrobot-Demo': 'true',
      'X-Domainrobot-Context': '1',
      'Authorization': `Basic ${Buffer.from(`${user}:${autodnsApiKey}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: {
      filters: [
        {
          key: "email",
          value: email,
          operator: "EQUAL",
        }
      ],
    },
  })

  return result

  // const validatedResult = resultSchema.parse(result)

  // return validatedResult.certificate.id
}

export async function registerDomain(domain: string) {
  const { autodnsApiKey } = useRuntimeConfig()

  const resultSchema = z.object({
    certificate: z.object({
      id: z.number(),
    }),
  })
  type ResultType = z.infer<typeof resultSchema>

  const result = await $fetch<ResultType>(`${autodnsApiUrl}/certificates`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${autodnsApiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      name: domain,
      type: 'managed',
      domain_names: [domain, `www.${domain}`],
    },
  })

  const validatedResult = resultSchema.parse(result)

  return validatedResult.certificate.id
}
