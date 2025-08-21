import z from 'zod'
import { DomainRobot, DomainRobotModels } from "js-domainrobot-sdk";

const autodnsApiUrl = 'https://api.autodns.com/v1'
const autodnsApiUser = 'api@markus-kottlaender.de'

async function createDomainContact(contact: {
  firstname: string
  lastname: string
  street: string
  city: string
  postalCode: string
  country: string
  email: string
}) {
  const { autodnsApiKey } = useRuntimeConfig()

  const resultSchema = z.object({
    data: z.object({
      id: z.number(),
    }),
  })
  type ResultType = z.infer<typeof resultSchema>

  const result = await $fetch<ResultType>(`${autodnsApiUrl}/contact`, {
    method: 'POST',
    headers: {
      'X-Domainrobot-Demo': 'true',
      'X-Domainrobot-Context': '1',
      'Authorization': `Basic ${Buffer.from(`${autodnsApiUser}:${autodnsApiKey}`).toString('base64')}`,
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

  const validatedResult = resultSchema.parse(result)

  return validatedResult.data.id
}

async function findDomainContact(email: string) {
  const { autodnsApiKey } = useRuntimeConfig()
  console.log(autodnsApiKey)

  const domainRobot = new DomainRobot({
    url: autodnsApiUrl,
    auth: {
      user: autodnsApiUser,
      password: autodnsApiKey,
      context: 4,
    },
  })

  const query = new DomainRobotModels.Query({
    'filters': [
      {
        "key": "email",
        "value": email,
        "operator": "EQUAL"
      },
    ],
  });

  const contacts = await domainRobot.contact().list(query)

  return contacts
}

async function registerDomain(domain: string, contactId: number) {
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

async function findOrCreateDomainContact(email: string) {
  const existingContactId = await findDomainContact(email)
  if (existingContactId) {
    return existingContactId
  }

  return createDomainContact({
    email,
    firstname: 'Emma',
    lastname: 'Herbst',
    street: 'Musterstraße 1',
    city: 'Musterstadt',
    postalCode: '12345',
    country: 'DE',
  })
}

export const autodns = {
  createDomainContact,
  findDomainContact,
  findOrCreateDomainContact,
  registerDomain,
}