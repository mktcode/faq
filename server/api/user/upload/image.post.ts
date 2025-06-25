import sharp from 'sharp'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const files = await readMultipartFormData(event)

  const imageUrls: string[] = []

  if (!files) {
    return { success: false, message: 'No files found', imageUrls }
  }

  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()

  const s3 = createS3Client()

  for (const file of files) {
    const isImage = file.type?.startsWith('image')

    if (!isImage) {
      return { success: false, message: 'Only images are allowed', imageUrls }
    }

    const fileName = file.filename || Math.random().toString(36).substring(7)
    const sanitizedFilename = fileName.replace(/[^a-z0-9.]/gi, '_')
    const filePath = `${user.id}/gallery/${sanitizedFilename}`

    const image = sharp(file.data)
    const metadata = await image.metadata()

    // ensure max dimensions of 2000x2000 and resize
    const maxSize = 2000
    if (metadata.width && metadata.height && (metadata.width > maxSize || metadata.height > maxSize)) {
      image.resize(maxSize, maxSize, { fit: 'inside' })
    }

    // reduce quality if file size is larger than 1MB
    if (metadata.size && metadata.size > 1e6) {
      image.jpeg({ quality: 75 })
      if (metadata.size && metadata.size > 1e6) {
        image.jpeg({ quality: 50 })
      }
    }

    // replace current extension in filepath with webp
    const webpFilePath = filePath.replace(/\.[^/.]+$/, '.webp')

    const command = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: webpFilePath,
      Body: Buffer.from(await image.toFormat('webp').toBuffer()),
      ContentType: 'image/webp',
      Metadata: {
        filename: fileName,
      },
    })
    await s3.send(command)

    imageUrls.push(`${s3Endpoint}/${s3BucketName}/${webpFilePath}`)
  }

  return { success: true, imageUrls }
})
