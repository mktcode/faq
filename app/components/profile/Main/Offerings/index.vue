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
  <ProfileMainSection
    :component-id="component.id"
    @edit="$emit('edit', $event)"
  >
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
  </ProfileMainSection>
</template>
