<script setup lang="ts">
defineProps<{
  label?: string
}>()

const color = defineModel('color', {
  type: String,
  default: 'hsl(199, 100%, 48%)',
})

const chip = computed(() => ({ backgroundColor: color.value }))
</script>

<template>
  <UFormField
    :label="label"
    class="flex-1"
  >
    <UPopover>
      <UButton
        color="neutral"
        variant="outline"
      >
        <template #leading>
          <span
            :style="chip"
            class="size-3 rounded-full"
          />
        </template>
      </UButton>

      <template #content>
        <UColorPicker
          v-model="color"
          format="hsl"
          class="p-2"
        />
      </template>
    </UPopover>
  </UFormField>
</template>
