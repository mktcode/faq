import { S3Client, HeadObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'

export const uploadedFileSchema = z.object({
  key: z.string(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
})
export const uploadedFilesSchema = z.array(uploadedFileSchema)
export type UploadedFile = z.infer<typeof uploadedFileSchema>

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

export async function getUserFiles(userId: number) {
  const { s3BucketName } = useRuntimeConfig()

  const s3 = createS3Client()
  const command = new ListObjectsV2Command({
    Bucket: s3BucketName,
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

export async function deleteFile(userId: number, fileKey: string) {
  const userIdInFileKey = fileKey.split('/')[0]

  if (!userIdInFileKey || Number(userIdInFileKey) !== userId) {
    throw new Error('File does not belong to this user')
  }
  
  const s3 = createS3Client()
  const { s3BucketName } = useRuntimeConfig()
  
  const command = new DeleteObjectCommand({
    Bucket: s3BucketName,
    Key: fileKey,
  })

  await s3.send(command)
}

export function getKeyFromUrl(url: string) {
  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()

  if (!url.startsWith(s3Endpoint)) {
    throw new Error('URL does not match S3 endpoint')
  }

  const key = url.replace(`${s3Endpoint}/${s3BucketName}/`, '')
  if (!key) {
    throw new Error('Invalid S3 URL format')
  }

  return key
}