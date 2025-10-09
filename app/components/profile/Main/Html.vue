<script setup lang="ts">
import type { HtmlComponentSchema } from '~~/types/db';

defineProps<{
  component: HtmlComponentSchema;
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
    <div class="w-full" v-html="component.html" />
  </div>
</template>
