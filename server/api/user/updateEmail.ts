import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
})

export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const emailConfirmationToken = crypto.randomUUID()

  await db
    .updateTable('users')
    .set({
      email,
      emailConfirmationToken,
    })
    .where('id', '=', user.id)
    .execute()

  await sendEmail({
    to: email,
    subject: 'Bitte bestätigen Sie Ihre E-Mail-Adresse',
    body: `Bitte klicken Sie auf den folgenden Link, um Ihre E-Mail-Adresse zu bestätigen: 
https://${user.userName}.${useRuntimeConfig().public.appHost}?confirmEmailToken=${emailConfirmationToken}`,
  })

  return { success: true, message: 'Email updated successfully' }
})
