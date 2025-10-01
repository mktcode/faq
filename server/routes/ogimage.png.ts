import sharp from "sharp"

const OGIMAGE_WIDTH = 1200
const OGIMAGE_HEIGHT = 630
const SYSTEM_FONT_FAMILY = "Roboto"
const AVG_CHAR_WIDTH_FACTOR = 0.55

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function calculateFontSize(text: string): number {
  const maxUsableWidth = OGIMAGE_WIDTH * 0.9 // leave 5% padding left/right
  const maxUsableHeight = OGIMAGE_HEIGHT * 0.6 // leave vertical breathing room

  const effectiveChars = Math.max(text.trim().length, 1)
  // Estimate size constrained by width
  const sizeByWidth = maxUsableWidth / (effectiveChars * AVG_CHAR_WIDTH_FACTOR)
  // Constrain by height as well
  let size = Math.min(sizeByWidth, maxUsableHeight)
  // Clamp to sensible bounds
  size = Math.max(80, Math.min(size, 320))
  return Math.round(size)
}

function calculateSecondaryFontSize(text: string, primaryFontSize: number): number {
  if (!text) return 0
  const maxUsableWidth = OGIMAGE_WIDTH * 0.8 // a bit more padding for the URL
  const effectiveChars = Math.max(text.trim().length, 1)
  const sizeByWidth = maxUsableWidth / (effectiveChars * (AVG_CHAR_WIDTH_FACTOR * 0.9))
  
  let ideal = Math.min(sizeByWidth, primaryFontSize * 0.35)
  ideal = Math.max(28, Math.min(ideal, 96))
  return Math.round(ideal)
}

async function getBufferFromUrl(url: string): Promise<Buffer | null> {
  try {
    const arrayBuffer = await $fetch<Buffer>(url, { responseType: "arrayBuffer" })
    return Buffer.from(arrayBuffer)
  } catch (error) {
    return null
  }
}

async function getDefaultBuffer(
  companyName: string,
  color: { h: number; s: number; l: number },
  canonicaleUri: string,
): Promise<Buffer> {
  const primaryColorHsl = toHslString(color)
  const text = escapeXml(companyName || "")
  const originalFontSize = calculateFontSize(text)
  const rawUrl = canonicaleUri || ""
  const cleanedUrl = escapeXml(
    rawUrl
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
  )
  const urlFontSize = calculateSecondaryFontSize(cleanedUrl, originalFontSize)
  const fontSize = Math.max(70, Math.round(originalFontSize * 0.9))
  const marginBetween = urlFontSize ? Math.round(Math.max(urlFontSize * 0.5, fontSize * 0.25, 40)) : 0
  const totalBlockHeight = fontSize + (urlFontSize ? marginBetween + urlFontSize : 0)
  const blockTop = (OGIMAGE_HEIGHT - totalBlockHeight) / 2
  const y1 = blockTop + fontSize // baseline for first line
  const y2 = urlFontSize ? y1 + marginBetween + urlFontSize : undefined

  const svg = `
    <svg width="${OGIMAGE_WIDTH}" height="${OGIMAGE_HEIGHT}" viewBox="0 0 ${OGIMAGE_WIDTH} ${OGIMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${primaryColorHsl}" />
      <text
        x="50%"
        y="${y1.toFixed(2)}"
        text-anchor="middle"
        font-size="${fontSize}"
        font-family="${SYSTEM_FONT_FAMILY}"
        font-weight="700"
        fill="#ffffff"
      >${text}</text>
      ${urlFontSize ? `<text x="50%" y="${y2?.toFixed(2)}" text-anchor="middle" font-size="${urlFontSize}" font-family="${SYSTEM_FONT_FAMILY}" font-weight="500" fill="#ffffff" opacity="0.9">${cleanedUrl}</text>` : ''}
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
        $profile.canonicalUri
      )
    }
  } else {
    const src = await useStorage('assets:server').getItemRaw('img/ogimage.png')

    return src
  }
})
