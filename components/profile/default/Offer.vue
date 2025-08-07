<script setup lang="ts">
const { settings, path } = await useProfile()

const items = computed(() => settings.value.components.offers.items.map(offer => ({
  title: offer.title,
  description: offer.description,
  slug: offer.slug,
})) || [])

const pathItem = computed(() => items.value.find(item => item.slug === path.replace('/', '')))
</script>

<template>
  <div class="my-24 w-full">
    <ProfileDefaultOfferItem
      v-if="pathItem"
      :item="pathItem"
    />
    <UCarousel
      v-else-if="items.length > 1"
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
      <ProfileDefaultOfferItem :item="item" />
    </UCarousel>
    <ProfileDefaultOfferItem
      v-else-if="items.length === 1"
      :item="items[0]"
    />
  </div>
</template>
