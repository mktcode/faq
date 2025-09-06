<script setup lang="ts">
import type { OfferingComponentSchema } from '~~/types/db';

defineProps<{
  component: OfferingComponentSchema;
}>()
</script>

<template>
  <div>
    <UCarousel
      v-if="component.items.length > 1"
      v-slot="{ item }"
      :dots="component.items.length > 1"
      :arrows="component.items.length > 1"
      auto-height
      :prev="{ variant: 'ghost', color: 'primary', size: 'xl', icon: 'i-heroicons-chevron-left-solid', class: 'disabled:hidden' }"
      :next="{ variant: 'ghost', color: 'primary', size: 'xl', icon: 'i-heroicons-chevron-right-solid', class: 'disabled:hidden' }"
      :autoplay="{ delay: 20000 }"
      :items="component.items"
      class="w-full"
      :ui="{
        container: 'transition-[height] duration-500 ease-in-out',
      }"
    >
      <ProfileMainOfferingsItem :item="item" />
    </UCarousel>
    <ProfileMainOfferingsItem
      v-else-if="component.items.length === 1"
      :item="component.items[0]"
    />
  </div>
</template>
