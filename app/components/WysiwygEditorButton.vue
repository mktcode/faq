<script setup lang="ts">
defineEmits<{
  click: () => void
}>()

defineProps<{
  icon?: string
  label?: string
  isActive: boolean
  loading?: boolean
}>()
</script>

<template>
  <UButton
    :label="label"
    :icon="icon"
    :loading="loading"
    @click.prevent="$emit('click')"
    :variant="isActive ? 'solid' : 'soft'"
  />
</template>
