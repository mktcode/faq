<script setup lang="ts">
defineEmits<{
  click: () => void
}>()

defineProps<{
  icon?: string
  label?: string
  isActive: boolean
}>()
</script>

<template>
  <UButton
    :label="label"
    :icon="icon"
    @click.prevent="$emit('click')"
    :variant="isActive ? 'solid' : 'soft'"
  />
</template>
