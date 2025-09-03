import z from 'zod'

// TODO: move to env
// TODO: check if this is the same for all domains at qboxmail
const subdomainVerifyIp = '185.97.217.16'

function makeRequest<ResultType>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: { body?: Record<string, any>, query?: Record<string, any> }) {
  const { qboxmailApiKey, qboxmailApiUrl } = useRuntimeConfig()

  return $fetch<ResultType>(`${qboxmailApiUrl}/${endpoint}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'X-Api-Token': qboxmailApiKey,
      'Content-Type': 'application/json',
    },
    body: data?.body,
    query: data?.query,
  })
}

function generatePassword() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
  const passwordLength = 16
  let password = ''
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

async function createDomainIfNotExists(domain: string) {
  const existingResultSchema = z.object({
    resources: z.array(z.object({
      code: z.string(),
    })),
  })
  type ExistingResultType = z.infer<typeof existingResultSchema>

  const existingDomains = await makeRequest<ExistingResultType>('GET', 'domains', { query: { query: domain } })
  const existingDomain = existingDomains.resources[0]

  if (existingDomain) {
    return {
      id: existingDomain.code,
      subdomainVerifyIp,
    }
  }

  const resultSchema = z.object({
    message: z.string(),
    resource_code: z.string(),
  })
  type ResultType = z.infer<typeof resultSchema>

  const postmasterPassword = generatePassword()

  const result = await makeRequest<ResultType>('POST', 'domains', {
    body: {
      name: domain,
      postmaster_password: postmasterPassword,
      postmaster_password_confirmation: postmasterPassword,
      max_email_accounts: 3,
    },
  })

  const validatedResult = resultSchema.parse(result)

  return {
    id: validatedResult.resource_code,
    subdomainVerifyIp,
  }
}

async function listMailboxes(domainCode: string) {
  try {
    const result = await makeRequest<{ resources: {
      code: string
      name: string
      email_address: string
      firstname: string
    }[] }>('GET', `domains/${domainCode}/email_accounts`)

    return result.resources
  }
  catch (error) {
    // INFO: For some reason qboxmail returns a 404 for an empty list *shrug*
    return []
  }
}

async function createMailbox(mailbox: string, domainCode: string, companyName: string) {
  const securePassword = generatePassword()
  await makeRequest('POST', `domains/${domainCode}/email_accounts`, {
    body: {
      name: mailbox,
      firstname: companyName,
      password: securePassword,
      password_confirmation: securePassword,
    },
  })
}

async function deleteMailbox(mailboxCode: string, domainCode: string) {
  await makeRequest('DELETE', `domains/${domainCode}/email_accounts/${mailboxCode}`)
}

async function checkMxRecords(domainCode: string) {
  try {
    await makeRequest<unknown>('PUT', `domains/${domainCode}/dns`)
    return true
  }
  catch (error) {
    return false
  }
}

async function checkDnsOwnership(domainCode: string) {
  try {
    await makeRequest<unknown>('PUT', `domains/${domainCode}/dns_ownership_check`)
    return true
  }
  catch (error) {
    return false
  }
}

export const qboxmail = {
  createDomainIfNotExists,
  checkMxRecords,
  checkDnsOwnership,
  listMailboxes,
  createMailbox,
  deleteMailbox,
}
