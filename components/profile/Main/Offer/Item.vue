<script setup lang="ts">
defineProps<{
  item: {
    title: string
    description: string
  }
}>()
</script>

<template>
  <div>
    <h2 class="text-3xl font-semibold mb-4 max-w-lg">
      {{ item.title }}
    </h2>
    <div
      class="mb-4 prose"
      v-html="item.description"
    />
  </div>
</template>
