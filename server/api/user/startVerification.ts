import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
  company: z.object({
    name: z.string().min(2).max(100),
    street: z.string().min(2).max(200),
    zip: z.string().min(2).max(20),
    city: z.string().min(2).max(100),
  }),
  subscription: z.enum(['S', 'L']),
})

export default defineEventHandler(async (event) => {
  const { email, company, subscription } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()

  const emailConfirmationToken = crypto.randomUUID()

  const settings = await getSettings(user.id)
  settings.public.company.name = company.name
  settings.public.company.street = company.street
  settings.public.company.zip = company.zip
  settings.public.company.city = company.city

  await db
    .updateTable('users')
    .set({
      email,
      emailConfirmationToken,
      settings: JSON.stringify(settings),
    })
    .where('id', '=', user.id)
    .execute()
  
  const mailTemplate = mailTemplates.verificationEmail(user.id, emailConfirmationToken, subscription)

  await sendEmail({
    to: email,
    subject: 'Bitte bestätigen Sie Ihre E-Mail-Adresse',
    html: mailTemplate.html,
    text: mailTemplate.text,
  })

  return { success: true, message: 'E-Mail erfolgreich aktualisiert.' }
})
