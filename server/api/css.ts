// (no imports)

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value))
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/css')

  if (!event.context.profile) {
    return
  }

  const settings = await getPublicSettings(event.context.profile.username)

  const match = settings.design.color.match(/hsl\(\s*([\d.]+),?\s+([\d.]+)%,?\s+([\d.]+)%\s*\)/)

  if (!match) {
    return '/* Invalid HSL color format */'
  }

  const hue = parseFloat(match[1])
  const saturation = parseFloat(match[2])
  const lightness = parseFloat(match[3])

  // sRGB HSL fallback (works everywhere). Kept similar to previous behavior.
  const hslFallback = `:root {\n  --color-website-50: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 50)}%);\n  --color-website-100: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 40)}%);\n  --color-website-200: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 30)}%);\n  --color-website-300: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 20)}%);\n  --color-website-400: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness + 10)}%);\n  --color-website-500: ${settings.design.color};\n  --color-website-600: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 10)}%);\n  --color-website-700: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 20)}%);\n  --color-website-800: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 30)}%);\n  --color-website-900: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 40)}%);\n  --color-website-950: hsl(${hue}, ${saturation}%, ${clampPercentage(lightness - 50)}%);\n  --color-website: var(--color-website-500);\n}`

  // Wide-gamut OKLCH approximation (mapped to Display-P3 where supported)
  // We derive chroma from the provided saturation and use a Tailwind-like lightness scale.
  const toPct = (v: number) => `${Math.round(v * 1000) / 10}%` // 1 decimal percent
  const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

  // Base chroma influenced by input saturation. OKLCH chroma ~ 0..0.37 in P3 typically.
  const baseC = clamp(0.06 + (saturation / 100) * 0.18, 0.04, 0.28)

  // Lightness map (approximation inspired by Tailwind’s palette spacing)
  const L: Record<string, number> = {
    50: 0.98,
    100: 0.95,
    200: 0.90,
    300: 0.82,
    400: 0.72,
    500: 0.65,
    600: 0.58,
    700: 0.50,
    800: 0.42,
    900: 0.35,
    950: 0.28,
  }

  // Chroma multipliers by shade; slightly lower at the extremes
  const CM: Record<string, number> = {
    50: 0.15,
    100: 0.25,
    200: 0.45,
    300: 0.65,
    400: 0.85,
    500: 1.0,
    600: 0.95,
    700: 0.80,
    800: 0.65,
    900: 0.50,
    950: 0.40,
  }

  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const

  const oklchLines = shades.map((k) => {
    const l = toPct(clamp(L[k]))
    const c = Math.round(clamp(baseC * CM[k]) * 1000) / 1000 // 3 decimals
    // Use OKLCH hue in degrees; HSL hue is a decent proxy here
    return `  --color-website-${k}: oklch(${l} ${c} ${hue});`
  })

  const oklchBlock = `@supports (color: oklch(60% 0.1 180)) {\n:root {\n${oklchLines.join('\n')}\n  --color-website: var(--color-website-500);\n}\n}`

  const css = `${hslFallback}\n\n${oklchBlock}\n\n.woot-widget-bubble {\n  background-color: var(--color-website) !important;\n}\n\n${settings.css}`

  return css
})
