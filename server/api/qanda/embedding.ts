import { z } from 'zod'

const querySchema = z.object({
  message: z.string(),
  username: z.string(),
})

export default defineEventHandler(async (event) => {
  const { message, username } = await getValidatedQuery(event, query => querySchema.parse(query))

  await requireProfileSubscription(username)

  const openai = createOpenAIClient()
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: message,
    encoding_format: 'float',
  })

  return embedding.data[0].embedding
})
