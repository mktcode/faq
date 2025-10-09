import { z } from 'zod'

const onlyLowerCaseAndDash = z.string().regex(/^[a-z0-9-]{1,63}$/, 'Invalid mailbox')
const bodySchema = z.object({
  mailbox: onlyLowerCaseAndDash,
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)

  const db = await getDatabaseConnection()
  const { mailbox } = await readValidatedBody(event, body => bodySchema.parse(body))

  if ($profile.mailboxes.includes(mailbox)) {
    throw createError({ statusCode: 409, statusMessage: 'Mailbox already exists.' })
  }

  $profile.mailboxes.push(mailbox)

  await db
    .updateTable('users')
    .set({ mailboxes: $profile.mailboxes.join(',') })
    .where('id', '=', $profile.id)
    .execute()

  setResponseStatus(event, 204)
})
