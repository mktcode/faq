<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>

<template>
  <div
    class="absolute inset-0 z-10"
    :style="{
      backgroundColor: toHslString(component.imageOverlay.color),
      opacity: (component.imageOverlay.opacity || 0) / 100,
    }"
  />
</template>
