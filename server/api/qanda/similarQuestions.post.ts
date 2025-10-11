import { sql } from 'kysely'
import { z } from 'zod'

const bodySchema = z.object({
  embedding: z.array(z.number()),
  username: z.string(),
})

export type SimilarQuestion = {
  id: number
  question: string
  answer: string
  distance: number
}

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { embedding, username } = await readValidatedBody(event, query => bodySchema.parse(query))

  const user = await db.selectFrom('users')
    .select(['id'])
    .where('userName', '=', username)
    .executeTakeFirstOrThrow()

  const similarQuestions = await sql<SimilarQuestion>`SELECT id, question, answer, VEC_DISTANCE_EUCLIDEAN(embedding, Vec_FromText(${JSON.stringify(embedding)})) as distance FROM qanda WHERE userId = ${user.id} ORDER BY distance ASC LIMIT 10;`
    .execute(db)

  return similarQuestions.rows
})
