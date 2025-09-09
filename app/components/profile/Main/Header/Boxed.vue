<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>

<template>
  <div class="max-w-5xl mx-auto pt-4 px-4 sm:pt-8 sm:px-8 overflow-hidden">
    <ProfileMainHeaderVideo v-if="component.video">
      <ProfileMainHeaderContent />
    </ProfileMainHeaderVideo>
    <ProfileMainHeaderImage v-else>
      <ProfileMainHeaderContent />
    </ProfileMainHeaderImage>
  </div>
</template>
