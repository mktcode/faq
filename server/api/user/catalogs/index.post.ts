import { catalogFormSchema } from '~/types/db/catalogs'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { id, name, info } = await readValidatedBody(event, body => catalogFormSchema.parse(body))
  const db = await getDatabaseConnection()

  await db
    .updateTable('catalogs')
    .set({
      name,
      info,
    })
    .where('id', '=', id)
    .where('userId', '=', user.id)
    .execute()

  return { success: true }
})
