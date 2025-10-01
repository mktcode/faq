import sharp from 'sharp'
import z from 'zod'
import { PutObjectCommand } from '@aws-sdk/client-s3'

// Body schema: coordinates are percentages (0-100) floating point numbers.
const bodySchema = z.object({
  imageUrl: z.string().url(),
  coordinates: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    w: z.number().min(0.0001).max(100),
    h: z.number().min(0.0001).max(100),
  }),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { imageUrl, coordinates } = await readValidatedBody(event, body => bodySchema.parse(body))

  const { s3BucketName, public: { s3Endpoint } } = useRuntimeConfig()
  const expectedPrefix = `${s3Endpoint}/${s3BucketName}/`

  if (!imageUrl.startsWith(expectedPrefix)) {
    return { success: false, message: 'Invalid image URL' }
  }

  // Extract key after bucket base
  const key = imageUrl.substring(expectedPrefix.length)

  // Ownership enforcement: key must start with user's id folder
  if (!key.startsWith(`${user.id}/`)) {
    return { success: false, message: 'Not allowed to modify this image' }
  }

  const s3 = createS3Client()

  // Fetch original object via HTTP (public URL)
  let originalBuffer: Buffer
  try {
    const res = await fetch(imageUrl)
    if (!res.ok) {
      return { success: false, message: 'Image not found' }
    }
    const arrayBuf = await res.arrayBuffer()
    originalBuffer = Buffer.from(arrayBuf)
  } catch (err) {
    console.error('Crop: error fetching original image via fetch', err)
    return { success: false, message: 'Failed to fetch original image' }
  }

  const image = sharp(originalBuffer)
  const meta = await image.metadata()
  if (!meta.width || !meta.height) {
    return { success: false, message: 'Could not read image dimensions' }
  }

  // Normalize percentages (0-100) to [0,1]
  const xPerc = coordinates.x / 100
  const yPerc = coordinates.y / 100
  const wPerc = coordinates.w / 100
  const hPerc = coordinates.h / 100

  // Clamp to [0,1]
  const clamp = (v: number) => Math.min(1, Math.max(0, v))
  const cx = clamp(xPerc)
  const cy = clamp(yPerc)
  let cw = clamp(wPerc)
  let ch = clamp(hPerc)

  // Ensure width/height don't exceed bounds considering origin
  if (cx + cw > 1) cw = 1 - cx
  if (cy + ch > 1) ch = 1 - cy

  // Compute pixel values (ensure minimum 1px)
  const left = Math.round(cx * meta.width)
  const top = Math.round(cy * meta.height)
  const width = Math.max(1, Math.round(cw * meta.width))
  const height = Math.max(1, Math.round(ch * meta.height))

  // Final safety: ensure extraction remains inside the image
  const safeWidth = Math.min(width, meta.width - left)
  const safeHeight = Math.min(height, meta.height - top)

  let cropped: sharp.Sharp = image.clone().extract({ left, top, width: safeWidth, height: safeHeight })

  // Optional max dimension similar to upload (inside fit, max 2000)
  const maxSize = 2000
  if (safeWidth > maxSize || safeHeight > maxSize) {
    cropped = cropped.resize(maxSize, maxSize, { fit: 'inside' })
  }

  // Produce webp (obtain buffer and also determine final dimensions for naming)
  const withMeta = await cropped.toFormat('webp')
  const outputBuffer = await withMeta.toBuffer()
  const finalMeta = await sharp(outputBuffer).metadata()
  const finalW = finalMeta.width || 0
  const finalH = finalMeta.height || 0

  // Derive new key: replace extension with _crop_<width>x<height>.webp
  const withoutExt = key.replace(/\.[^./]+$/, '') // remove last extension
  const croppedKey = `${withoutExt}_crop_${finalW}x${finalH}.webp`

  try {
    await s3.send(new PutObjectCommand({
      Bucket: s3BucketName,
      Key: croppedKey,
      Body: outputBuffer,
      ContentType: 'image/webp',
      Metadata: { source: key },
    }))
  } catch (err) {
    console.error('Crop: error uploading cropped image', err)
    return { success: false, message: 'Failed to upload cropped image' }
  }

  const croppedImageUrl = `${s3Endpoint}/${s3BucketName}/${croppedKey}`
  return { success: true, imageUrl: croppedImageUrl }
})
