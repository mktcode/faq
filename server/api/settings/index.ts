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
    .selectAll()
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()

  const settings = await db
    .selectFrom('settings')
    .selectAll()
    .where('userId', '=', user.id)
    .executeTakeFirstOrThrow()

  return settingsFormSchema.parse(
    typeof settings.settings === 'string'
      ? JSON.parse(settings.settings)
      : settings.settings,
  )
})
