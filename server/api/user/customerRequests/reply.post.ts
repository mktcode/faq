import { z } from 'zod'

const bodySchema = z.object({
  customerRequestId: z.number(),
  replyMessage: z.string().min(1, 'Die Antwort darf nicht leer sein.'),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { customerRequestId, replyMessage } = await readValidatedBody(event, body => bodySchema.parse(body))

  const customerRequest = await db
    .selectFrom('customerRequests')
    .select(['id', 'email'])
    .where('userId', '=', user.id)
    .where('id', '=', customerRequestId)
    .executeTakeFirstOrThrow()

  await db.insertInto('messages')
    .values({
      customerRequestId: customerRequest.id,
      body: replyMessage,
      isCustomer: false,
      embedding: null,
    })
    .execute()

  if (customerRequest.email) {
    await sendEmail({
      to: customerRequest.email,
      subject: `${user.userName}: Antwort auf Ihre Anfrage`,
      body: replyMessage,
    })
  }
})
