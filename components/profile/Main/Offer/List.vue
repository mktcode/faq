<script setup lang="ts">
defineProps<{
  items: {
    title: string
    description: string
  }[]
}>()
</script>

<template>
  <div class="my-24 w-full flex flex-col gap-y-24 max-w-lg mx-auto">
    <TransitionGroup name="list">
      <ProfileMainOfferItem
        v-for="item in items"
        :key="item.title"
        :item="item"
      />
    </TransitionGroup>
  </div>
</template>
