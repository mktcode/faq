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
  <div
    class="w-full relative"
    :id="component.key + '-' + component.id"
    :class="component.key"
  >
    <ProfileMainEditSectionButton
      v-if="$profile.isOwned || $profile.isAdmin"
      @click="$emit('edit', component.id)"
    />
    <ProfileMainHeaderFullscreen v-if="component.height === 'full'" :component="component" />
    <ProfileMainHeaderHalfscreen v-else-if="component.height === 'half'" :component="component" />
    <ProfileMainHeaderAutoheight v-else-if="component.height === 'auto'" :component="component" />
    <ProfileMainHeaderBoxed v-else-if="component.height === 'boxed'" :component="component" />
  </div>
</template>
