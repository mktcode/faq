import { z } from 'zod'

const inputSchema = z.object({
  userId: z.number(),
  amount: z.number().min(0),
})

export default defineEventHandler(async (event) => {
  if (await denies(event, isAdmin)) {
    throw createError({
      status: 403,
      statusMessage: 'Du bist kein Admin.',
    })
  }

  const { userId, amount } = await readValidatedBody(event, body => inputSchema.parse(body))
  const db = await getDatabaseConnection()

  await db
    .insertInto('payments')
    .values({
      userId,
      amount,
      paymentMethod: 'manual',
      status: 'succeeded',
    })
    .execute()

  await updateUserBalance(userId)

  return {
    success: true,
    error: null,
  }
})
