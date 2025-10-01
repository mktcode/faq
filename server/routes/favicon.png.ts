import sharp from "sharp"

const FAVICON_SIZE = 512

// Cache for embedded font
let ROBOTO_WOFF2_BASE64: string | null = null

async function getRobotoFontBase64(): Promise<string | null> {
  if (ROBOTO_WOFF2_BASE64) return ROBOTO_WOFF2_BASE64
  const raw = await useStorage('assets:server').getItemRaw('fonts/roboto.woff2')
  if (!raw) return null
  ROBOTO_WOFF2_BASE64 = Buffer.from(raw).toString('base64')
  return ROBOTO_WOFF2_BASE64
}

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

  const fontBase64 = await getRobotoFontBase64()
  const fontFaceBlock = fontBase64
    ? `
    <style>
      @font-face {
        font-family: 'FaviconRoboto';
        src: url(data:font/woff2;base64,${fontBase64}) format('woff2');
        font-style: normal;
        font-weight: 100 900;
        font-stretch: 100%;
        font-display: swap;
        unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      text {
        font-family: 'FaviconRoboto';
      }
    </style>`
    : ""

  const svg = `
    <svg width="${FAVICON_SIZE}" height="${FAVICON_SIZE}" viewBox="0 0 ${FAVICON_SIZE} ${FAVICON_SIZE}" xmlns="http://www.w3.org/2000/svg">
      ${fontFaceBlock}
      <rect width="100%" height="100%" fill="${primaryColorHsl}" />
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        font-size="${FAVICON_SIZE * 0.6}"
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
