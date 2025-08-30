<script setup lang="ts">
defineProps<{
  label?: string
}>()

// TODO: change settings schema for all colors  to hsl objects

const color = defineModel('color', {
  type: String,
  default: 'hsl(199, 100%, 48%)',
})

const hue = ref(199)
const saturation = ref(100)
const lightness = ref(48)

const style = computed(() => ({ backgroundColor: `hsl(${hue.value}, ${saturation.value}%, ${lightness.value}%) !important` }))

watch([hue, saturation, lightness], ([newHue, newSaturation, newLightness]) => {
  color.value = `hsl(${newHue}, ${newSaturation}%, ${newLightness}%)`
})
</script>

<template>
  <UFormField :label="label">
    <UPopover>
      <UButton
        color="neutral"
        variant="outline"
        class="w-full p-1"
      >
        <div
          :style="style"
          class="w-full h-8 rounded-lg"
        />
      </UButton>

      <template #content>
        <div class="flex flex-col gap-2 p-2 w-48">
          <div class="flex items-center">
            <span class="text-sm text-gray-500 mr-2">Farbton</span>
            <span class="text-sm font-semibold">{{ hue }}</span>
          </div>
          <USlider v-model="hue" :min="0" :max="360" :step="1" size="xl" />
          <div class="flex items-center">
            <span class="text-sm text-gray-500 mr-2">Sättigung</span>
            <span class="text-sm font-semibold">{{ saturation }}</span>
          </div>
          <USlider v-model="saturation" :min="0" :max="100" :step="1" size="xl" />
          <div class="flex items-center">
            <span class="text-sm text-gray-500 mr-2">Helligkeit</span>
            <span class="text-sm font-semibold">{{ lightness }}</span>
          </div>
          <USlider v-model="lightness" :min="0" :max="100" :step="1" size="xl" />
        </div>
      </template>
    </UPopover>
  </UFormField>
</template>
