import z from 'zod'

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value))
}

const querySchema = z.object({
  userName: z.string().min(3, 'Username must be at least 3 characters long'),
})

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/css')

  const { userName } = await getValidatedQuery(event, query => querySchema.parse(query))
  const settings = await getPublicSettings(userName)

  const match = settings.design.color.match(/hsl\(\s*([\d.]+),?\s+([\d.]+)%,?\s+([\d.]+)%\s*\)/)

  if (!match) {
    return '/* Invalid HSL color format */'
  }

  const hue = parseFloat(match[1])
  const saturation = parseFloat(match[2])
  const lightness = parseFloat(match[3])

  const css = `:root {
    --color-website-50: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 50)}%);
    --color-website-100: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 40)}%);
    --color-website-200: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 30)}%);
    --color-website-300: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 20)}%);
    --color-website-400: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 10)}%);
    --color-website-500: ${settings.design.color};
    --color-website-600: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 10)}%);
    --color-website-700: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 20)}%);
    --color-website-800: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 30)}%);
    --color-website-900: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 40)}%);
    --color-website-950: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 50)}%);
    --color-website: var(--color-website-500);
}

${settings.css}`

  return css
})
