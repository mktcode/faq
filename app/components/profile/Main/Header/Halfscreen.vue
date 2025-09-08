<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>
#
<template>
  <ProfileMainHeaderVideo
    v-if="component.video"
    class="h-[50vh]"
  >
    <ProfileMainHeaderContent />
  </ProfileMainHeaderVideo>
  <ProfileMainHeaderImage
    v-else
    class="h-[50vh]"
  >
    <ProfileMainHeaderContent />
  </ProfileMainHeaderImage>
</template>
