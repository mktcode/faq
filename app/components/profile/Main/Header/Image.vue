<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>

<template>
  <ProfileMainHeaderBase
    class="bg-cover bg-center"
    :style="{ backgroundImage: component.image ? `url(${component.image})` : 'none' }"
    :component="component"
  >
    <ProfileMainHeaderOverlay />
    <slot />
  </ProfileMainHeaderBase>
</template>
