<script setup lang="ts">
defineProps<{ currentActivity: { label: string } }>()
</script>

<template>
  <div class="text-gray-400 flex items-center justify-center gap-2 p-4">
    <UIcon
      name="i-lucide-loader-circle"
      class="inline-block size-5 animate-spin"
    />
    <span class="animate-pulse italic">{{ currentActivity.label }}</span>
  </div>
</template>
