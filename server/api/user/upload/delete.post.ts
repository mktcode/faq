import { z } from 'zod'

const bodySchema = z.object({
  url: z.string().url(),
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { url } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()

  if (!url.startsWith(s3Endpoint)) {
    return { success: true }
  }

  let success = false

  const fileKey = url.replace(`${s3Endpoint}/${s3BucketName}/`, '')
  if (!fileKey.startsWith(`${$profile.id}/`)) {
    throw createError({ statusCode: 403, message: 'Unauthorized file deletion' })
  }

  try {
    await useStorage('userfiles').removeItem(fileKey)
    success = true
  }
  catch (error) {
    console.error('Error deleting file:', error)
  }

  return { success }
})
