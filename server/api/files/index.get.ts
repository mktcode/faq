import { getUserFiles } from '~/server/utils/s3'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  return await getUserFiles(user.id)
})
