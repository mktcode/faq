<script setup lang="ts">
defineProps<{
  items: {
    title: string
    description: string
  }[]
}>()
</script>

<template>
  <div class="my-24 w-full flex flex-col gap-y-24 max-w-7xl mx-auto">
    <ProfileMainOfferItem
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      class="!max-w-7xl"
    />
  </div>
</template>
