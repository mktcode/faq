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
    .select(['id'])
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()
  
  const insertResult = await db.insertInto('customerRequests')
    .values({
      userId: user.id,
      name,
      email: email || null,
      phone: phone || null,
      status: 'pending',
    })
    .executeTakeFirstOrThrow()

  const customerRequestId = insertResult.insertId

  await sql`INSERT INTO messages (customerRequestId, body, embedding, isCustomer) VALUES (${customerRequestId}, ${message}, VEC_FromText(${JSON.stringify(embedding)}), true)`
    .execute(db)

  return { success: true }
})
