export const availableFonts = ref([
  {
    label: 'Roboto',
    value: 'roboto',
  },
  {
    label: 'Open Sans',
    value: 'open-sans',
  },
  {
    label: 'Lato',
    value: 'lato',
  },
  {
    label: 'Montserrat',
    value: 'montserrat',
  },
  {
    label: 'Poppins',
    value: 'poppins',
  },
  {
    label: 'Merriweather',
    value: 'merriweather',
  },
  {
    label: 'Lora',
    value: 'lora',
  },
  {
    label: 'Playfair Display',
    value: 'playfair-display',
  },
])

export type AvailableFont = typeof availableFonts.value[number]

export const availableColors = ref([
  {
    label: 'Schwarz',
    value: 'black',
  },
  {
    label: 'Weiß',
    value: 'white',
  },
  {
    label: 'Rot',
    value: 'red',
  },
  {
    label: 'Orange',
    value: 'orange',
  },
  {
    label: 'Bernstein',
    value: 'amber',
  },
  {
    label: 'Gelb',
    value: 'yellow',
  },
  {
    label: 'Limette',
    value: 'lime',
  },
  {
    label: 'Grün',
    value: 'green',
  },
  {
    label: 'Smaragd',
    value: 'emerald',
  },
  {
    label: 'Blaugrün',
    value: 'teal',
  },
  {
    label: 'Cyan',
    value: 'cyan',
  },
  {
    label: 'Himmelblau',
    value: 'sky',
  },
  {
    label: 'Blau',
    value: 'blue',
  },
  {
    label: 'Indigo',
    value: 'indigo',
  },
  {
    label: 'Violett',
    value: 'violet',
  },
  {
    label: 'Lila',
    value: 'purple',
  },
  {
    label: 'Fuchsie',
    value: 'fuchsia',
  },
  {
    label: 'Rosa',
    value: 'pink',
  },
  {
    label: 'Rose',
    value: 'rose',
  },
  {
    label: 'Schiefer',
    value: 'slate',
  },
  {
    label: 'Stein',
    value: 'stone',
  },
])

export type AvailableColor = typeof availableColors.value[number]

export function getColorClass(colorValue: string | undefined, type: string = 'bg'): string {
  if (!colorValue) return ''

  if (type === 'text') {
    switch (colorValue) {
      case 'white': return 'text-white'
      case 'black': return 'text-black'
      case 'red': return 'text-red-500'
      case 'orange': return 'text-orange-500'
      case 'amber': return 'text-amber-500'
      case 'yellow': return 'text-yellow-500'
      case 'lime': return 'text-lime-500'
      case 'green': return 'text-green-500'
      case 'emerald': return 'text-emerald-500'
      case 'teal': return 'text-teal-500'
      case 'cyan': return 'text-cyan-500'
      case 'sky': return 'text-sky-500'
      case 'blue': return 'text-blue-500'
      case 'indigo': return 'text-indigo-500'
      case 'violet': return 'text-violet-500'
      case 'purple': return 'text-purple-500'
      case 'fuchsia': return 'text-fuchsia-500'
      case 'pink': return 'text-pink-500'
      case 'rose': return 'text-rose-500'
      case 'slate': return 'text-slate-500'
      case 'gray': return 'text-gray-500'
      case 'zinc': return 'text-zinc-500'
      case 'neutral': return 'text-neutral-500'
      case 'stone': return 'text-stone-500'
      default: return ''
    }
  }

  switch (colorValue) {
    case 'white': return 'bg-white'
    case 'black': return 'bg-black'
    case 'red': return 'bg-red-500'
    case 'orange': return 'bg-orange-500'
    case 'amber': return 'bg-amber-500'
    case 'yellow': return 'bg-yellow-500'
    case 'lime': return 'bg-lime-500'
    case 'green': return 'bg-green-500'
    case 'emerald': return 'bg-emerald-500'
    case 'teal': return 'bg-teal-500'
    case 'cyan': return 'bg-cyan-500'
    case 'sky': return 'bg-sky-500'
    case 'blue': return 'bg-blue-500'
    case 'indigo': return 'bg-indigo-500'
    case 'violet': return 'bg-violet-500'
    case 'purple': return 'bg-purple-500'
    case 'fuchsia': return 'bg-fuchsia-500'
    case 'pink': return 'bg-pink-500'
    case 'rose': return 'bg-rose-500'
    case 'slate': return 'bg-slate-500'
    case 'gray': return 'bg-gray-500'
    case 'zinc': return 'bg-zinc-500'
    case 'neutral': return 'bg-neutral-500'
    case 'stone': return 'bg-stone-500'
    default: return ''
  }
}
