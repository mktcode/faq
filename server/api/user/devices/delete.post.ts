import z from "zod"

const bodySchema = z.object({
  credentialId: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const db = await getDatabaseConnection()
  const { credentialId } = await readValidatedBody(event, body => bodySchema.parse(body))

  await db
    .deleteFrom('webauthnCredentials')
    .where('userId', '=', $profile.id)
    .where('credentialId', '=', credentialId)
    .execute()

  return { success: true }
})
