import { PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const files = await readMultipartFormData(event)

  let videoUrl: string = ''

  if (!files || files.length === 0) {
    return { success: false, message: 'Es wurden keine Dateien übertragen.', videoUrl }
  }

  const file = files[0]

  if (!file) {
    return { success: false, message: 'Es wurde keine Datei übertragen.', videoUrl }
  }

  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()

  const isVideoMp4 = file.type?.startsWith('video/mp4')

  if (!isVideoMp4) {
    return { success: false, message: 'Nur MP4-Dateien sind erlaubt', videoUrl }
  }

  const fileName = file.filename || Math.random().toString(36).substring(7)
  const sanitizedFilename = fileName.replace(/[^a-z0-9.]/gi, '_')
  const filePath = `${user.id}/gallery/${sanitizedFilename}`

  const fileSize = file.data.length

  if (fileSize > 10e6) {
    return { success: false, message: 'Die Videodatei darf maximal 10 MB groß sein.', videoUrl }
  }

  await useStorage('userfiles').setItemRaw(filePath, Buffer.from(file.data))
  await useStorage('userfiles').setMeta(filePath, {
    key: filePath,
    filename: sanitizedFilename,
    type: 'video',
    size: fileSize,
    lastModified: new Date().toISOString(),
  })

  videoUrl = `${s3Endpoint}/${s3BucketName}/${filePath}`

  return { success: true, videoUrl, message: null }
})
