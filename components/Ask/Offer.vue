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
      :prev="{ variant: 'ghost' }"
      :next="{ variant: 'ghost' }"
      :autoplay="{ delay: 10000 }"
      :items="items"
      class="w-full"
    >
      <h2 class="text-2xl font-semibold mb-4">
        {{ item.title }}
      </h2>
      <div
        class="mb-4"
        v-html="item.description"
      />
    </UCarousel>
  </div>
</template>
