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
  <div>
    <UCarousel
      v-slot="{ item }"
      dots
      arrows
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
      <h2 class="text-2xl font-semibold mb-4">
        {{ item.title }}
      </h2>
      <div
        class="mb-4 prose"
        v-html="item.description"
      />
    </UCarousel>
  </div>
</template>
