import { customerRequestFormSchema } from '~/types/db'

export default defineEventHandler(async (event) => {
  const { username, name, email, phone, message } = await readValidatedBody(event, body => customerRequestFormSchema.parse(body))
  const db = await getDatabaseConnection()

  const user = await db.selectFrom('users')
    .select(['id'])
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()

  await db.insertInto('customerRequests').values({
    userId: user.id,
    name,
    email: email || null,
    phone: phone || null,
    message,
    status: 'pending',
  }).execute()

  return { success: true }
})
