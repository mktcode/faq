<script setup lang="ts">
import type { OfferingComponentSchema } from '~~/types/db';

defineProps<{
  component: OfferingComponentSchema;
}>()
</script>

<template>
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
</template>
