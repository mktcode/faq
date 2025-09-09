<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>

<template>
  <ProfileMainHeaderBase :component="component">
    <video
      class="absolute inset-0 z-0 w-full h-full object-cover object-center pointer-events-none"
      :src="component.video"
      :poster="component.image || undefined"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      aria-hidden="true"
    />
    <ProfileMainHeaderOverlay :component="component" />
    <slot />
  </ProfileMainHeaderBase>
</template>
