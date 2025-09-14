<script setup lang="ts">
import type { MenuComponentSchema } from '~~/types/db';

defineProps<{
  component: MenuComponentSchema;
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
    <div class="w-full flex justify-start gap-2 max-w-5xl mx-auto py-4 px-6 transition-all">
      <UButton
        v-for="(item, index) in component.items"
        :key="index"
        :label="item.title"
        :to="item.url"
        :target="item.openInNewTab ? '_blank' : '_self'"
        variant="ghost"
      />
    </div>
  </div>
</template>
