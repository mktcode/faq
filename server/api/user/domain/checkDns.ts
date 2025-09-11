import { z } from 'zod'

const inputSchema = z.object({
  domain: z.string(),
})

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const { domain } = await readValidatedBody(event, body => inputSchema.parse(body))

  const isACorrect = await domainUtils.checkA(domain)

  return { isACorrect }
})
