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
    .select(['email'])
    .where('userId', '=', user.id)
    .where('id', '=', customerRequestId)
    .executeTakeFirstOrThrow()

  if (!customerRequest.email) {
    throw createError({
      statusCode: 400,
      message: 'Diese Kundenanfrage hat keine E-Mail-Adresse.',
    })
  }

  sendEmail({
    to: customerRequest.email,
    subject: `${user.userName}: Antwort auf Ihre Anfrage`,
    body: replyMessage,
  })
})
