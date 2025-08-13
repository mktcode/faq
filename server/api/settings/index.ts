import { z } from 'zod'
import { getPublicSettings } from '~/server/utils/user'

const querySchema = z.object({
  username: z.string(),
})

export default defineEventHandler(async (event) => {
  const { username } = await getValidatedQuery(event, query => querySchema.parse(query))

  return await getPublicSettings(username)
})
