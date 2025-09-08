<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>

<template>
  <ProfileMainHeaderVideo v-if="component.video">
    <ProfileMainHeaderContent />
  </ProfileMainHeaderVideo>
  <ProfileMainHeaderImage v-else>
    <ProfileMainHeaderContent />
  </ProfileMainHeaderImage>
</template>
