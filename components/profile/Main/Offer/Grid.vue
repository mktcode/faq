<script setup lang="ts">
defineProps<{
  items: {
    title: string
    description: string
  }[]
}>()
</script>

<template>
  <div class="my-24 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <ProfileMainOfferItem
      v-for="(item, index) in items"
      :key="index"
      :item="item"
    />
  </div>
</template>
