import z from "zod"

const bodySchema = z.object({
  otp: z.string().length(8, 'Der OTP muss 8 Zeichen lang sein.')
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { otp } = await readValidatedBody(event, (body) => bodySchema.parse(body))

  const db = await getDatabaseConnection()

  const createdAt = new Date()

  await db
    .updateTable('users')
    .set({
      oneTimePassword: otp,
      oneTimePasswordCreatedAt: createdAt
    })
    .where('id', '=', user.id)
    .execute()

  return { success: true }
})
