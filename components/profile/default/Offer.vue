<script setup lang="ts">
const { offers } = defineProps<{
  offers: {
    title: string
    description: string
  }[]
}>()

const items = offers.map(offer => ({
  title: offer.title,
  description: offer.description,
}))
</script>

<template>
  <div class="my-24 w-full">
    <UCarousel
      v-slot="{ item }"
      :dots="items.length > 1"
      :arrows="items.length > 1"
      auto-height
      :prev="{ variant: 'ghost' }"
      :next="{ variant: 'ghost' }"
      :autoplay="{ delay: 20000 }"
      :items="items"
      class="w-full"
      :ui="{
        container: 'transition-[height] duration-500 ease-in-out',
      }"
    >
      <h2 class="text-3xl font-semibold mb-4">
        {{ item.title }}
      </h2>
      <div
        class="mb-4 prose"
        v-html="item.description"
      />
    </UCarousel>
  </div>
</template>
