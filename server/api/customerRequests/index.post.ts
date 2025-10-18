import { z } from 'zod'
import { FormComponentSchema } from '~~/types/db'

const inputSchema = z.object({
  contactFormComponentId: z.number(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  extraFields: z.record(z.any()),
})

export default defineEventHandler(async (event) => {
  const { contactFormComponentId, name, email, phone, message, extraFields } = await readValidatedBody(event, body => inputSchema.parse(body))
  const $profile = requireProfile(event)
  const contactFormComponent = $profile.settings.public.pages.map(page => page.components).flat().find(c => c.key === 'form' && c.id === contactFormComponentId) as FormComponentSchema

  if (!contactFormComponent) {
    throw createError({ statusCode: 400, message: 'Kontaktformular-Komponente nicht gefunden' })
  }

  for (const field of contactFormComponent.fields) {
    if (field.required) {
      const value = extraFields[field.label]
      if (field.type === 'checkbox') {
        if (value !== true) {
          throw createError({ statusCode: 400, message: `Feld "${field.label}" ist erforderlich` })
        }
      } else {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          throw createError({ statusCode: 400, message: `Feld "${field.label}" ist erforderlich` })
        }
      }
    }
  }

  const extraFieldsText = Object.entries(extraFields).map(([key, value]) => {
    return `${key}: ${value}`
  }).join('\n')

  const db = await getDatabaseConnection()

  const user = await db.selectFrom('users')
    .select(['id', 'email', 'settings'])
    .where('userName', '=', $profile.username)
    .executeTakeFirstOrThrow()

  const settings = await getPublicSettings(user.id)

  const uuid = crypto.randomUUID()

  const insertResult = await db.insertInto('customerRequests')
    .values({
      userId: user.id,
      uuid,
      name,
      email: email || null,
      phone: phone || null,
      status: 'pending',
    })
    .executeTakeFirstOrThrow()

  const customerRequestId = insertResult.insertId ? Number(insertResult.insertId) : null

  if (!customerRequestId) {
    throw createError({ statusCode: 500, message: 'Failed to create customer request' })
  }

  const messageText = `Sie haben eine neue Anfrage erhalten.\n\nName: ${name}\n\nTelefon: ${phone}\n\nE-Mail: ${email}\n\nNachricht: ${message}\n\n${extraFieldsText}`
  const messageHtml = messageText.replace(/\n/g, '<br/>')

  await db.insertInto('messages')
    .values({
      customerRequestId,
      body: messageText,
      isCustomer: true,
    })
    .execute()
  
  const toEmail = settings.company.email || user.email

  if (toEmail) {
    await sendEmail({
      to: toEmail,
      subject: `Neue Anfrage über Ihre Website`,
      text: messageText,
      html: messageHtml,
      replyTo: email || undefined,
    })
  }

  return { success: true }
})
