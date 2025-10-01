import sharp from 'sharp'
import z from 'zod'

const bodySchema = z.object({
  url: z.string().url(),
  coordinates: z.object({
    x: z.number().min(0),
    y: z.number().min(0),
    w: z.number().min(1),
    h: z.number().min(1),
  }),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { url, coordinates } = await readValidatedBody(event, body => bodySchema.parse(body))
  
  const croppedImageUrl = ''

  return { success: true, imageUrl: croppedImageUrl }
})
