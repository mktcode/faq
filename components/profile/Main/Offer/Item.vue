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
    <h2 class="text-3xl font-semibold mb-4">
      {{ item.title }}
    </h2>
    <div
      class="prose max-w-none"
      v-html="item.description"
    />
  </div>
</template>
