import { z } from 'zod'
import { settingsFormSchema } from '~/types/db'

const querySchema = z.object({
  username: z.string(),
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { username } = await getValidatedQuery(event, query => querySchema.parse(query))

  const user = await db
    .selectFrom('users')
    .select(['settings'])
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()

  // TODO: auto-repair settings with defaults
  return settingsFormSchema.parse(
    typeof user.settings === 'string'
      ? JSON.parse(user.settings)
      : user.settings,
  )
})
