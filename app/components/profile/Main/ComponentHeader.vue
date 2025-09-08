<script setup lang="ts">
import type { ComponentSettingsBaseSchema } from '~~/types/db';

defineProps<{
  component: ComponentSettingsBaseSchema;
}>()
</script>

<template>
  <h2
    v-if="component.showTitle"
    class="text-2xl font-semibold mb-4"
  >
    {{ component.title }}
  </h2>
  <p
    v-if="component.description"
    class="mb-6 text-gray-600"
    v-html="component.description"
  />
</template>