import { sql } from 'kysely'
import { z } from 'zod'

const inputSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  embedding: z.array(z.number()).nullable(),
})

export default defineEventHandler(async (event) => {
  const { username, name, email, phone, message, embedding } = await readValidatedBody(event, body => inputSchema.parse(body))
  const db = await getDatabaseConnection()

  const user = await db.selectFrom('users')
    .select(['id', 'email'])
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()

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

  const customerRequestId = insertResult.insertId

  await sql`INSERT INTO messages (customerRequestId, body, embedding, isCustomer) VALUES (${customerRequestId}, ${message}, VEC_FromText(${JSON.stringify(embedding)}), true)`
    .execute(db)

  if (user.email) {
    await sendEmail({
      to: user.email,
      subject: `Neue Anfrage über Ihre Website`,
      body: `Sie haben eine neue Anfrage von ${name} erhalten.\n\nNachricht: ${message}\n\nBitte loggen Sie sich in Ihr Profil ein, um darauf zu antworten.`,
    })
  }

  return { success: true }
})
