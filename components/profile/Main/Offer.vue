<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

const items = computed(() => $profile.settings.components.offers.items.map(offer => ({
  title: offer.title,
  description: offer.description,
})) || [])
</script>

<template>
  <div class="my-24 w-full">
    <UCarousel
      v-if="items.length > 1"
      v-slot="{ item }"
      :dots="items.length > 1"
      :arrows="items.length > 1"
      auto-height
      :prev="{ variant: 'ghost', color: 'primary', size: 'xl', icon: 'i-heroicons-chevron-left-solid', class: 'disabled:hidden' }"
      :next="{ variant: 'ghost', color: 'primary', size: 'xl', icon: 'i-heroicons-chevron-right-solid', class: 'disabled:hidden' }"
      :autoplay="{ delay: 20000 }"
      :items="items"
      class="w-full"
      :ui="{
        container: 'transition-[height] duration-500 ease-in-out',
      }"
    >
      <ProfileMainOfferItem :item="item" />
    </UCarousel>
    <ProfileMainOfferItem
      v-else-if="items.length === 1"
      :item="items[0]"
    />
  </div>
</template>
