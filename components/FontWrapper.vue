<script setup lang="ts">
defineProps<{
  font: string
}>()
</script>

<template>
  <div
    :class="{
      'font-roboto': font === 'roboto',
      'font-open-sans': font === 'open-sans',
      'font-lato': font === 'lato',
      'font-montserrat': font === 'montserrat',
      'font-poppins': font === 'poppins',
      'font-merriweather': font === 'merriweather',
      'font-lora': font === 'lora',
      'font-playfair-display': font === 'playfair-display',
    }"
  >
    <slot />
  </div>
</template>
