import { sql } from 'kysely'
import { z } from 'zod'
import type { SettingsForm } from '~~/types/db'

const inputSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  embedding: z.array(z.number()).length(1536).nullable(),
})

export default defineEventHandler(async (event) => {
  const { username, name, email, phone, message, embedding } = await readValidatedBody(event, body => inputSchema.parse(body))
  const db = await getDatabaseConnection()

  const user = await db.selectFrom('users')
    .select(['id', 'email', 'settings'])
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()

  const settings: SettingsForm = typeof user.settings === 'string' ? JSON.parse(user.settings) : user.settings

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

  console.log(embedding)

  if (embedding) {
    await sql`INSERT INTO messages (customerRequestId, body, embedding, isCustomer) VALUES (${customerRequestId}, ${message}, VEC_FromText(${JSON.stringify(embedding)}), true)`
      .execute(db)
  }
  else {
    await db.insertInto('messages')
      .values({
        customerRequestId,
        body: message,
        isCustomer: true,
      })
      .execute()
  }

  const toEmail = settings?.company?.email || user.email

  if (toEmail) {
    await sendEmail({
      to: toEmail,
      subject: `Neue Anfrage über Ihre Website`,
      text: `Sie haben eine neue Anfrage von ${name} erhalten.\n\nNachricht: ${message}\n\n`,
      html: `<p>Sie haben eine neue Anfrage von <strong>${name}</strong> erhalten.</p><p><strong>Nachricht:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`,
      replyTo: email || undefined,
    })
  }

  return { success: true }
})
