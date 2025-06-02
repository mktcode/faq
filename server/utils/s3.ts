import { S3Client, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { z } from 'zod'

export function createS3Client() {
  const { s3AccessKey, s3SecretKey, public: { s3Endpoint } } = useRuntimeConfig()

  return new S3Client({
    region: 'eu-central',
    credentials: {
      accessKeyId: s3AccessKey,
      secretAccessKey: s3SecretKey,
    },
    endpoint: s3Endpoint,
  })
}

export async function s3FileExists(bucket: string, fileKey: string) {
  const s3 = createS3Client()
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: fileKey,
  })

  try {
    await s3.send(command)
    return true
  }
  catch (error) {
    if (
      typeof error === 'object'
      && error !== null
      && 'name' in error
      && error.name === 'NotFound'
    ) {
      return false
    }
    throw error
  }
}

export const uploadedFileSchema = z.object({
  key: z.string(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
})

export type UploadedFile = z.infer<typeof uploadedFileSchema>

export const uploadedFilesSchema = z.array(uploadedFileSchema)

export async function getUserFiles(userId: number, bucket = 'mktcms') {
  const s3 = createS3Client()
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: `${userId}/`,
  })

  const result = await s3.send(command)

  const files = (result.Contents || [])
    .map(obj => ({
      key: obj.Key || '',
      name: obj.Key?.split('/').pop() || '',
      type: obj.Key?.split('.').pop() || 'plain',
      size: obj.Size || 0,
    }))

  uploadedFilesSchema.parse(files)

  return files
}
