import { sql } from 'kysely'
import { customerRequestFormSchema } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { username, name, email, phone, message, embedding } = await readValidatedBody(event, body => customerRequestFormSchema.parse(body))
  const db = await getDatabaseConnection()

  const user = await db.selectFrom('users')
    .select(['id'])
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()

  await sql`INSERT INTO customerRequests (userId, name, email, phone, message, embedding, status) VALUES (${user.id}, ${name}, ${email}, ${phone}, ${message}, VEC_FromText(${JSON.stringify(embedding)}), 'pending')`
    .execute(db)

  return { success: true }
})
