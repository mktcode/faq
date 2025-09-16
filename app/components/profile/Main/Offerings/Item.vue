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
    <div
      v-html="item.description"
    />
  </div>
</template>
