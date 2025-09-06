<script setup lang="ts">
import type { OfferingComponentSchema } from '~~/types/db';

defineProps<{
  component: OfferingComponentSchema;
}>()
</script>

<template>
  <div class="flex flex-col gap-y-24">
    <TransitionGroup name="list">
      <ProfileMainOfferingsItem
        v-for="item in component.items"
        :key="item.id"
        :item="item"
      />
    </TransitionGroup>
  </div>
</template>
