<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()
</script>

<template>
  <div class="w-full relative">
    <UButton
      v-if="$profile.isOwned"
      label="Sektion bearbeiten"
      trailing-icon="i-heroicons-pencil"
      variant="soft"
      size="xl"
      class="absolute top-8 -left-44 hover:-left-4 pl-8 transition-all rounded-full z-10"
      @click="$emit('edit', component.id)"
    />
    <ProfileMainHeaderFullscreen v-if="component.height === 'full'" :component="component" />
    <ProfileMainHeaderHalfscreen v-else-if="component.height === 'half'" :component="component" />
    <ProfileMainHeaderAutoheight v-else-if="component.height === 'auto'" :component="component" />
    <ProfileMainHeaderBoxed v-else-if="component.height === 'boxed'" :component="component" />
  </div>
</template>
