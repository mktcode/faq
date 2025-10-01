import sharp from "sharp"

const FAVICON_SIZE = 512

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
  const firstLetter = companyName.trim()[0].toUpperCase()

  const svg = `
    <svg width="${FAVICON_SIZE}" height="${FAVICON_SIZE}" viewBox="0 0 ${FAVICON_SIZE} ${FAVICON_SIZE}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${primaryColorHsl}" />
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        font-size="${FAVICON_SIZE * 0.6}"
        font-family="system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif"
        font-weight="700"
        fill="#ffffff"
        dy=".35em"
      >${firstLetter}</text>
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
    if ($profile.settings.public.meta.favicon) {
      buffer = await getBufferFromUrl($profile.settings.public.meta.favicon)
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
    const src = await useStorage('assets:server').getItemRaw('img/favicon.png')

    return src
  }
})
