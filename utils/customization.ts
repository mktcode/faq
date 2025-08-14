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
