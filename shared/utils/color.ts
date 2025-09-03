export const toHslString = ({ h, s, l }: { h: number, s: number, l: number }): string => {
  return `hsl(${h}, ${s}%, ${l}%)`
}
