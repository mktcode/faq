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
    <h2 class="font-semibold">
      {{ item.title }}
    </h2>
    <div
      v-html="item.description"
    />
  </div>
</template>
