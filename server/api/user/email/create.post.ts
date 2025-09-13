import { z } from 'zod'

const onlyLowerCaseAndDash = z.string().regex(/^[a-z0-9-]{1,63}$/, 'Invalid mailbox')
const bodySchema = z.object({
  mailbox: onlyLowerCaseAndDash,
})

export default defineEventHandler(async (event) => {
  const me = await requireMe(event)

  const db = await getDatabaseConnection()
  const { mailbox } = await readValidatedBody(event, body => bodySchema.parse(body))
  
  const mailboxes = me.mailboxes.split(',')
  if (mailboxes.includes(mailbox)) {
    throw createError({ statusCode: 409, statusMessage: 'Mailbox already exists.' })
  }

  mailboxes.push(mailbox)

  await db
    .updateTable('users')
    .set({ mailboxes: mailboxes.join(',') })
    .where('id', '=', me.id)
    .execute()

  setResponseStatus(event, 204)
})
