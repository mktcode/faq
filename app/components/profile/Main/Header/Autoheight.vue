<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>

<template>
  <ProfileMainHeaderVideo
    v-if="component.video"
    :component="component"
  >
    <ProfileMainHeaderContent :component="component" />
  </ProfileMainHeaderVideo>
  <ProfileMainHeaderImage
    v-else
    :component="component"
  >
    <ProfileMainHeaderContent :component="component" />
  </ProfileMainHeaderImage>
</template>
