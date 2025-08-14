import z from 'zod'

const querySchema = z.object({
  userName: z.string().min(3, 'Username must be at least 3 characters long'),
})

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/css')

  const { userName } = await getValidatedQuery(event, query => querySchema.parse(query))
  const settings = await getPublicSettings(userName)

  return settings.css
})
