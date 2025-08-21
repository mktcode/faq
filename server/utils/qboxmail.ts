import z from 'zod'

const autodnsApiUrl = 'https://api.qboxmail.com/api'

function generatePostmasterPassword() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
  const passwordLength = 16
  let password = ''
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

export async function createQboxmailDomain(domain: string) {
  const { qboxmailApiKey } = useRuntimeConfig()

  const resultSchema = z.object({
    message: z.string(),
    resource_code: z.string(),
  })
  type ResultType = z.infer<typeof resultSchema>

  const postmasterPassword = generatePostmasterPassword()

  const result = await $fetch<ResultType>(`${autodnsApiUrl}/domains`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Api-Token': qboxmailApiKey,
      'Content-Type': 'application/json',
    },
    body: {
      name: domain,
      postmaster_password: postmasterPassword,
      postmaster_password_confirmation: postmasterPassword,
      max_email_accounts: 3
    },
  })

  return result

  // const validatedResult = resultSchema.parse(result)

  // return validatedResult.certificate.id
}
