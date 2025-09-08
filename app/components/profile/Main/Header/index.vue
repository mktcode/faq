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
      class="absolute top-8 -left-48 hover:-left-4 pl-8 transition-all rounded-full z-10"
      @click="$emit('edit', component.id)"
    />
    <ProfileMainHeaderFullscreen v-if="$profile.settings.public.header.height === 'full'" :component="component" />
    <ProfileMainHeaderHalfscreen v-else-if="$profile.settings.public.header.height === 'half'" :component="component" />
    <ProfileMainHeaderAutoheight v-else-if="$profile.settings.public.header.height === 'auto'" :component="component" />
    <ProfileMainHeaderBoxed v-else-if="$profile.settings.public.header.height === 'boxed'" :component="component" />
  </div>
</template>
