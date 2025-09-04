import { z } from 'zod'

const querySchema = z.object({
  message: z.string(),
  username: z.string(),
})

export default defineEventHandler(async (event) => {
  const { message, username } = await getValidatedQuery(event, query => querySchema.parse(query))

  if (!event.context.profile?.subscription.plan) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You must have an active subscription to access this resource.',
    })
  }

  const openai = createOpenAIClient()
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: message,
    encoding_format: 'float',
  })

  return embedding.data[0]?.embedding || null
})
