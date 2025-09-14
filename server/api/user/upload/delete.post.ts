import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'

const bodySchema = z.object({
  url: z.string().url(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { url } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()

  if (!url.startsWith(s3Endpoint)) {
    return { success: true }
  }

  const s3 = createS3Client()
  let success = false

  const fileKey = url.replace(`${s3Endpoint}/${s3BucketName}/`, '')
  if (!fileKey.startsWith(`${user.id}/`)) {
    throw createError({ statusCode: 403, message: 'Unauthorized file deletion' })
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: s3BucketName,
      Key: fileKey,
    })
    await s3.send(command)
    success = true
  }
  catch (error) {
    console.error('Error deleting file:', error)
  }

  return { success }
})
