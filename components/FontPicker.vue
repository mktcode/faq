<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  title?: string
  subtitle?: string
}>(), {
  title: 'Lorem ipsum dolor sit amet.',
  subtitle: 'Lorem ipsum dolor sit amet.',
})

const font = defineModel('font', {
  type: String,
  default: 'roboto',
})
</script>

<template>
  <UFormField
    :label="label"
    name="font"
    class="flex-1"
  >
    <USelect
      v-model="font"
      class="w-full"
      :items="availableFonts"
    >
      <template #item-label="{ item }">
        <div class="text-gray-400">
          {{ item.label }}
        </div>
        <div
          class="whitespace-nowrap flex flex-col w-64 text-xl"
          :class="{
            'font-roboto': item.value === 'roboto',
            'font-open-sans': item.value === 'open-sans',
            'font-lato': item.value === 'lato',
            'font-montserrat': item.value === 'montserrat',
            'font-poppins': item.value === 'poppins',
            'font-merriweather': item.value === 'merriweather',
            'font-lora': item.value === 'lora',
            'font-playfair-display': item.value === 'playfair-display',
          }"
        >
          <div class="font-bold">
            {{ title || 'Lorem ipsum.' }}
          </div>
          {{ subtitle || title || 'Dolor sit amet. Consectetur adipiscing elit.' }}
        </div>
      </template>
    </USelect>
  </UFormField>
</template>
