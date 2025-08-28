<script setup lang="ts">
defineProps<{
  items: {
    title: string
    description: string
  }[]
}>()
</script>

<template>
  <div class="my-24 w-full flex flex-wrap items-start justify-center gap-x-16 gap-y-24">
    <TransitionGroup name="list">
      <ProfileMainOfferItem
        v-for="item in items"
        :key="item.title"
        :item="item"
      />
    </TransitionGroup>
  </div>
</template>
