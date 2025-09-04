import sharp from 'sharp'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const files = await readMultipartFormData(event)

  if (!files || files.length === 0) {
    return { success: false, message: 'No files found', imageUrl: null }
  }

  const file = files[0]

  if (!file) {
    return { success: false, message: 'No file found', imageUrl: null }
  }

  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()

  const s3 = createS3Client()

  const isImage = file.type?.startsWith('image')

  if (!isImage) {
    return { success: false, message: 'Only images are allowed', imageUrl: null }
  }

  const fileName = 'logo.webp'
  const filePath = `${user.id}/${fileName}`

  const image = sharp(file.data)
  const metadata = await image.metadata()

  const maxSize = 2000
  if (metadata.width && metadata.height && (metadata.width > maxSize || metadata.height > maxSize)) {
    image.resize(maxSize, maxSize, { fit: 'inside' })
  }

  if (metadata.size && metadata.size > 1e6) {
    image.jpeg({ quality: 75 })
    if (metadata.size && metadata.size > 1e6) {
      image.jpeg({ quality: 50 })
    }
  }

  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: filePath,
    Body: Buffer.from(await image.toFormat('webp').toBuffer()),
    ContentType: 'image/webp',
    Metadata: {
      filename: fileName,
    },
  })
  await s3.send(command)

  const imageUrl = `${s3Endpoint}/${s3BucketName}/${filePath}`

  return { success: true, imageUrl }
})
