import sharp from "sharp"
import { join } from "node:path"

const OGIMAGE_WIDTH = 1200
const OGIMAGE_HEIGHT = 630

async function getBufferFromUrl(url: string): Promise<Buffer | null> {
  try {
    const arrayBuffer = await $fetch<Buffer>(url, { responseType: "arrayBuffer" })
    return Buffer.from(arrayBuffer)
  } catch (error) {
    return null
  }
}

async function getDefaultBuffer(companyName: string, color: { h: number; s: number; l: number }): Promise<Buffer> {
  const primaryColorHsl = toHslString(color)

  const svg = `
    <svg width="${OGIMAGE_WIDTH}" height="${OGIMAGE_HEIGHT}" viewBox="0 0 ${OGIMAGE_WIDTH} ${OGIMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${primaryColorHsl}" />
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        font-size="${OGIMAGE_WIDTH * 0.6}"
        font-family="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif"
        font-weight="700"
        fill="#ffffff"
        dy=".35em"
      >${companyName}</text>
    </svg>
  `

  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer()

  return buffer
}

export default defineEventHandler(async (event) => {
  event.node.res.setHeader("Content-Type", "image/png")

  const $profile = event.context.profile
  let buffer: Buffer | null = null

  if ($profile) {
    if ($profile.settings.public.meta.ogimage) {
      buffer = await getBufferFromUrl($profile.settings.public.meta.ogimage)
    }
    
    if (buffer) {
      return buffer
    } else {
      return getDefaultBuffer(
        $profile.settings.public.company.name,
        $profile.settings.public.design.color,
      )
    }
  } else {
    const src = join(process.cwd(), "app", "assets", "img", "ogimage.png")

    const buffer = await sharp(src)
      .resize(OGIMAGE_WIDTH, OGIMAGE_HEIGHT, { fit: "cover" })
      .png()
      .toBuffer()

    return buffer
  }
})
