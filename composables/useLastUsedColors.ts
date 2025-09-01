import { useLocalStorage } from '@vueuse/core'

export default function useLastUsedColors() {
  const lastUsedColors = useLocalStorage<{ h: number, s: number, l: number }[]>('lastUsedColors', () => [])

  function addColor(color: { h: number, s: number, l: number }) {
    if (!lastUsedColors.value.find(c => c.h === color.h && c.s === color.s && c.l === color.l)) {
      lastUsedColors.value.push(color)
      lastUsedColors.value = lastUsedColors.value.slice(-10)
    }
  }

  return {
    lastUsedColors,
    addColor,
  }
}
