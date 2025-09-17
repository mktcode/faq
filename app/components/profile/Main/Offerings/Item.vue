<script setup lang="ts">
import type { OfferingComponentSchema } from '~~/types/db';

defineProps<{
  item: OfferingComponentSchema['items'][number]
}>()
</script>

<template>
  <div>
    <h2 class="font-semibold">
      {{ item.title }}
    </h2>
    <img
      v-if="item.image"
      :src="item.image"
      alt="Offering Image"
      class="w-full rounded-lg"
    />
    <div
      v-html="item.description"
    />
  </div>
</template>
