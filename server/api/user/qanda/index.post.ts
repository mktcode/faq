import { sql } from 'kysely'
import { qandaFormSchema } from '~/types/db/qanda'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { id, answer, question } = await readValidatedBody(event, body => qandaFormSchema.parse(body))
  const db = await getDatabaseConnection()

  if (id) {
    await db
      .updateTable('qanda')
      .set({
        question,
        answer,
      })
      .where('id', '=', id)
      .where('userId', '=', user.id)
      .execute()
  }
  else {
    const openai = createOpenAIClient()
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
      encoding_format: 'float',
    })

    await sql`INSERT INTO qanda (userId, question, questionEmbedding, answer) VALUES (${user.id}, ${question}, VEC_FromText(${JSON.stringify(embedding.data[0].embedding)}), ${answer})`
      .execute(db)
  }

  return { success: true }
})
