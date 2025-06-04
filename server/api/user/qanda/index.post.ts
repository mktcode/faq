import { sql } from 'kysely'
import { qandaFormSchema } from '~/types/db/qanda'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { id, answer, question, topic } = await readValidatedBody(event, body => qandaFormSchema.parse(body))
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
      .where('userId', '=', user.id)
      .execute()
  }
  else {
    await sql`INSERT INTO qanda (userId, question, questionEmbedding, answer, topic) VALUES (${user.id}, ${question}, VEC_FromText('[0.3, 0.5, 0.2]'), ${answer}, ${topic})`
      .execute(db)
  }

  return { success: true }
})
