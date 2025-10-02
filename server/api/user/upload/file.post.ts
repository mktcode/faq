import type { DownloadsComponentSchema } from '~~/types/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const files = await readMultipartFormData(event)

  const uploadedFiles: DownloadsComponentSchema['items'] = []

  if (!files) {
    return { success: false, message: 'No files found', uploadedFiles }
  }

  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()

  for (const file of files) {
    const fileName = file.filename || Math.random().toString(36).substring(7)
    const sanitizedFilename = fileName.replace(/[^a-z0-9.]/gi, '_')
    const filePath = `${user.id}/downloads/${sanitizedFilename}`
    const contentType = file.type || 'application/octet-stream'

    const url = `${s3Endpoint}/${s3BucketName}/${filePath}`

    await useStorage('userfiles').setItemRaw(filePath, Buffer.from(file.data))
    await useStorage('userfiles').setMeta(filePath, {
      key: filePath,
      filename: sanitizedFilename,
      type: 'file',
      size: file.data.length,
      lastModified: new Date().toISOString(),
    })

    uploadedFiles.push({
      title: fileName,
      description: '',
      type: contentType,
      url,
    })
  }

  return { success: true, uploadedFiles }
})
