import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'

const inputSchema = z.object({
  key: z.string(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { key } = await readValidatedBody(event, body => inputSchema.parse(body))

  const userIdInFileKey = key.split('/')[0]

  if (!userIdInFileKey || Number(userIdInFileKey) !== user.id) {
    return { success: false, message: 'Datei gehört nicht zu diesem Benutzer' }
  }

  const s3 = createS3Client()
  const command = new DeleteObjectCommand({
    Bucket: 'mktcms',
    Key: key,
  })
  await s3.send(command)

  return { success: true, message: 'Datei gelöscht' }
})
