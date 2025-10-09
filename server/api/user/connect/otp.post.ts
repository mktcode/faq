import z from "zod"

const bodySchema = z.object({
  otp: z.string().length(8, 'Der OTP muss 8 Zeichen lang sein.')
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { otp } = await readValidatedBody(event, (body) => bodySchema.parse(body))

  const db = await getDatabaseConnection()

  const createdAt = new Date()

  await db
    .updateTable('users')
    .set({
      oneTimePassword: otp,
      oneTimePasswordCreatedAt: createdAt
    })
    .where('id', '=', $profile.id)
    .execute()

  return { success: true }
})
