<script setup lang="ts">
import type { OfferingComponentSchema } from '~~/types/db';

defineProps<{
  component: OfferingComponentSchema;
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
      trailing-icon="i-heroicons-pencil-square"
      variant="outline"
      size="xl"
      class="absolute top-4 -left-44 hover:-left-4 pl-5 transition-all rounded-full z-10"
      @click="$emit('edit', component.id)"
    />

    <div class="max-w-5xl mx-auto py-24 px-6">
      <ProfileMainComponentHeader :component="component" />
  
      <ProfileMainOfferingsCarousel
        v-if="component.layout === 'carousel'"
        :component="component"
      />
      <ProfileMainOfferingsGrid
        v-else-if="component.layout === 'grid'"
        :component="component"
      />
      <ProfileMainOfferingsList
        v-else-if="component.layout === 'list'"
        :component="component"
      />
    </div>
  </div>
</template>
