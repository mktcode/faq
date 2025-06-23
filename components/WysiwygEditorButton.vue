<script setup lang="ts">
defineEmits<{
  click: () => void
}>()

defineProps<{
  isActive: boolean
}>()
</script>

<template>
  <button
    class="px-2 py-1 rounded-lg cursor-pointer hover:bg-primary-100 text-primary-950"
    :class="{ 'font-bold bg-primary-500 hover:bg-primary-600 text-white': isActive }"
    @click.prevent="$emit('click')"
  >
    <slot />
  </button>
</template>
