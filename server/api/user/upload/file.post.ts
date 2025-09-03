import { PutObjectCommand } from '@aws-sdk/client-s3'
import type { SettingsForm } from '~~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const files = await readMultipartFormData(event)

  const uploadedFiles: SettingsForm['public']['components']['downloads']['items'] = []

  if (!files) {
    return { success: false, message: 'No files found', uploadedFiles }
  }

  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()

  const s3 = createS3Client()

  for (const file of files) {
    const fileName = file.filename || Math.random().toString(36).substring(7)
    const sanitizedFilename = fileName.replace(/[^a-z0-9.]/gi, '_')
    const filePath = `${user.id}/downloads/${sanitizedFilename}`
    const contentType = file.type || 'application/octet-stream'

    const command = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: filePath,
      Body: file.data,
      ContentType: contentType,
      Metadata: {
        filename: fileName,
      },
    })
    await s3.send(command)

    uploadedFiles.push({
      title: fileName,
      description: '',
      type: contentType,
      url: `${s3Endpoint}/${s3BucketName}/${filePath}`,
    })
  }

  return { success: true, uploadedFiles }
})
