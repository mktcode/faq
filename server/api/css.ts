export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/css')

  if (!event.context.profile) {
    return
  }

  const settings = await getPublicSettings(event.context.profile.username)

  const hslColor = toHslString(settings.design.color)

  const colorMixBlock = `@supports (color: color-mix(in oklch, white 50%, black 50%)) {
  :root {
    --color-website-50:  color-mix(in oklch, white 94%, ${hslColor} 6%);
    --color-website-100: color-mix(in oklch, white 88%, ${hslColor} 12%);
    --color-website-200: color-mix(in oklch, white 78%, ${hslColor} 22%);
    --color-website-300: color-mix(in oklch, white 62%, ${hslColor} 38%);
    --color-website-400: color-mix(in oklch, white 46%, ${hslColor} 54%);
    --color-website-500: ${hslColor};
    --color-website-600: color-mix(in oklch, black 7%,  ${hslColor} 93%);
    --color-website-700: color-mix(in oklch, black 16%, ${hslColor} 84%);
    --color-website-800: color-mix(in oklch, black 30%, ${hslColor} 70%);
    --color-website-900: color-mix(in oklch, black 46%, ${hslColor} 54%);
    --color-website-950: color-mix(in oklch, black 60%, ${hslColor} 40%);
    --color-website: ${hslColor};
  }
}`

  const css = `${colorMixBlock}\n\n${settings.css}}`

  return css
})
