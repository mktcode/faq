import { z } from 'zod'

const bodySchema = z.object({
  domain: z.string(),
})

export default defineEventHandler(async (event) => {
  const { domain } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const isACorrect = await checkDomainA(domain)
  if (!isACorrect) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid A record' })
  }

  await db
    .updateTable('users')
    .set({ domain, domainIsExternal: true })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
