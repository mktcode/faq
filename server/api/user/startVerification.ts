import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
  company: z.object({
    name: z.string().min(2).max(100),
    street: z.string().min(2).max(200),
    zip: z.string().min(2).max(20),
    city: z.string().min(2).max(100),
    phone: z.string().min(5).max(20),
  }),
  subscription: z.enum(['S', 'L']),
})

export default defineEventHandler(async (event) => {
  const { email, company, subscription } = await readValidatedBody(event, body => bodySchema.parse(body))
  const $profile = await requireProfileWithPermission(event)
  const db = await getDatabaseConnection()

  const emailConfirmationToken = crypto.randomUUID()

  $profile.settings.public.company.name = company.name
  $profile.settings.public.company.street = company.street
  $profile.settings.public.company.zip = company.zip
  $profile.settings.public.company.city = company.city
  $profile.settings.public.company.phone = company.phone
  $profile.settings.public.company.email = email

  await db
    .updateTable('users')
    .set({
      email,
      emailConfirmationToken,
      settings: JSON.stringify($profile.settings),
    })
    .where('id', '=', $profile.id)
    .execute()

  const mailTemplate = mailTemplates.verificationEmail($profile.id, emailConfirmationToken, subscription)

  await sendEmail({
    to: email,
    subject: 'Bitte bestätigen Sie Ihre E-Mail-Adresse',
    html: mailTemplate.html,
    text: mailTemplate.text,
  })

  return { success: true, message: 'E-Mail erfolgreich aktualisiert.' }
})
