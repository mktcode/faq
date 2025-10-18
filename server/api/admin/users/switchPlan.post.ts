import z from 'zod';

const bodySchema = z.object({
  userId: z.number(),
  plan: z.enum(['S', 'L']).nullable(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const { userId, plan } = await readValidatedBody(event, body => bodySchema.parse(body))
  
  const db = await getDatabaseConnection()
  await db
    .updateTable('users')
    .set({
      plan: plan,
    })
    .where('id', '=', userId)
    .execute()

  return { success: true }
})
