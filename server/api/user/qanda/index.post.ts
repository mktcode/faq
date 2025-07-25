import { sql } from 'kysely'
import { qandaFormSchema } from '~/types/db/qanda'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const me = await getMe(event)
  const body = await readValidatedBody(event, body => qandaFormSchema.parse(body))
  const { answer, question } = body
  let { id } = body
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
    const insertResult = await db
      .insertInto('qanda')
      .values({
        userId: user.id,
        question,
        answer,
      })
      .executeTakeFirstOrThrow()

    if (!insertResult.insertId) {
      throw new Error('Failed to insert user')
    }

    id = Number(insertResult.insertId)
  }

  if (me?.isSubscribed) {
    const openai = createOpenAIClient()
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
      encoding_format: 'float',
    })

    await sql`UPDATE qanda SET embedding = VEC_FromText(${JSON.stringify(embedding.data[0].embedding)}) WHERE id = ${id} AND userId = ${user.id}`
      .execute(db)
  }
  else {
    await db.updateTable('qanda')
      .set({
        embedding: null,
      })
      .where('id', '=', id)
      .where('userId', '=', user.id)
      .execute()
  }

  return { success: true }
})
