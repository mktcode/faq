import { z } from 'zod'

const inputSchema = z.object({
  domain: z.string(),
})

export default defineEventHandler(async (event) => {
  const { domain } = await readValidatedBody(event, body => inputSchema.parse(body))

  const isACorrect = await checkDomainA(domain)
  const isMxCorrect = await checkDomainMx(domain, `mail.solihost.de`)

  return { isACorrect, isMxCorrect }
})
