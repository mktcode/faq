function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value))
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/css')

  if (!event.context.profile) {
    return
  }

  const settings = await getPublicSettings(event.context.profile.username)

  const hue = settings.design.color.h
  const saturation = settings.design.color.s
  const lightness = settings.design.color.l

  const hslFallback = `:root {
  --color-website-50: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 50)}%);
  --color-website-100: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 40)}%);
  --color-website-200: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 30)}%);
  --color-website-300: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 20)}%);
  --color-website-400: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 10)}%);
  --color-website-500: ${toHslString(settings.design.color)};
  --color-website-600: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 10)}%);
  --color-website-700: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 20)}%);
  --color-website-800: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 30)}%);
  --color-website-900: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 40)}%);
  --color-website-950: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 50)}%);
  --color-website: var(--color-website-500);
}`
  const colorMixBlock = `@supports (color: color-mix(in oklch, white 50%, black 50%)) {
  :root {
    --color-website-50:  color-mix(in oklch, white 94%, var(--color-website-500) 6%);
    --color-website-100: color-mix(in oklch, white 88%, var(--color-website-500) 12%);
    --color-website-200: color-mix(in oklch, white 78%, var(--color-website-500) 22%);
    --color-website-300: color-mix(in oklch, white 62%, var(--color-website-500) 38%);
    --color-website-400: color-mix(in oklch, white 46%, var(--color-website-500) 54%);
    --color-website-500: ${toHslString(settings.design.color)};
    --color-website-600: color-mix(in oklch, black 7%,  var(--color-website-500) 93%);
    --color-website-700: color-mix(in oklch, black 16%, var(--color-website-500) 84%);
    --color-website-800: color-mix(in oklch, black 30%, var(--color-website-500) 70%);
    --color-website-900: color-mix(in oklch, black 46%, var(--color-website-500) 54%);
    --color-website-950: color-mix(in oklch, black 60%, var(--color-website-500) 40%);
    --color-website: var(--color-website-500);
  }
}`

  const css = `${hslFallback}\n\n${colorMixBlock}\n\n${settings.css}`

  return css
})
