import { qandaFormSchema } from '~/types/db/qanda'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { id, catalogId, answer, question, topic } = await readValidatedBody(event, body => qandaFormSchema.parse(body))
  const db = await getDatabaseConnection()

  if (id) {
    await db
      .updateTable('qanda')
      .set({
        question,
        answer,
        topic,
      })
      .where('id', '=', id)
      .where('catalogId', '=', catalogId)
      .where('userId', '=', user.id)
      .execute()
  }
  else {
    await db
      .insertInto('qanda')
      .values({
        userId: user.id,
        catalogId,
        question,
        answer,
        topic,
      })
      .execute()
  }

  return { success: true }
})
