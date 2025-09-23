import z from "zod"

const bodySchema = z.object({
  credentialId: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await getDatabaseConnection()
  const { credentialId } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db
    .deleteFrom('webauthnCredentials')
    .where('userId', '=', user.id)
    .where('credentialId', '=', credentialId)
    .execute()

  return { success: true }
})
