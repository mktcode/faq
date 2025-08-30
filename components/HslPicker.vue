<script setup lang="ts">
defineProps<{
  label?: string
}>()

const h = defineModel('h', {
  type: Number,
  default: 199
})

const s = defineModel('s', {
  type: Number,
  default: 100
})

const l = defineModel('l', {
  type: Number,
  default: 48
})

const style = computed(() => ({ backgroundColor: `hsl(${h.value}, ${s.value}%, ${l.value}%) !important` }))
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
            <span class="text-sm font-semibold">{{ h }}</span>
          </div>
          <USlider v-model="h" :min="0" :max="360" :step="1" size="xl" />
          <div class="flex items-center">
            <span class="text-sm text-gray-500 mr-2">Sättigung</span>
            <span class="text-sm font-semibold">{{ s }}</span>
          </div>
          <USlider v-model="s" :min="0" :max="100" :step="1" size="xl" />
          <div class="flex items-center">
            <span class="text-sm text-gray-500 mr-2">Helligkeit</span>
            <span class="text-sm font-semibold">{{ l }}</span>
          </div>
          <USlider v-model="l" :min="0" :max="100" :step="1" size="xl" />
        </div>
      </template>
    </UPopover>
  </UFormField>
</template>
