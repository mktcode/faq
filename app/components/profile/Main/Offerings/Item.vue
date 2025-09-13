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
      class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
      v-html="item.description"
    />
  </div>
</template>
