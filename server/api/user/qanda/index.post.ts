import { sql } from 'kysely'
import { qandaFormSchema } from '~~/types/db/qanda'

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
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
      .where('userId', '=', $profile.id)
      .execute()
  }
  else {
    const insertResult = await db
      .insertInto('qanda')
      .values({
        userId: $profile.id,
        question,
        answer,
      })
      .executeTakeFirstOrThrow()

    if (!insertResult.insertId) {
      throw new Error('Failed to insert user')
    }

    id = Number(insertResult.insertId)
  }

  if (event.context.profile?.subscription.plan) {
    const openai = createOpenAIClient()
    const result = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
      encoding_format: 'float',
    })

    const embedding = result.data[0]?.embedding

    if (embedding) {
      await sql`UPDATE qanda SET embedding = VEC_FromText(${JSON.stringify(embedding)}) WHERE id = ${id} AND userId = ${$profile.id}`
        .execute(db)
    }
  }
  else {
    await db.updateTable('qanda')
      .set({
        embedding: null,
      })
      .where('id', '=', id)
      .where('userId', '=', $profile.id)
      .execute()
  }

  return { success: true }
})
