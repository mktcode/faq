<script setup lang="ts">
const { $profile } = useProfile()

const items = computed(() => $profile.settings.public.components.offers.items.map(offer => ({
  title: offer.title,
  description: offer.description,
})) || [])
</script>

<template>
  <ProfileMainOfferCarousel
    v-if="$profile.settings.public.components.offers.layout === 'carousel'"
    :items="items"
  />
  <ProfileMainOfferGrid
    v-else-if="$profile.settings.public.components.offers.layout === 'grid'"
    :items="items"
  />
  <ProfileMainOfferList
    v-else-if="$profile.settings.public.components.offers.layout === 'list'"
    :items="items"
  />
  <ProfileMainOfferListWide
    v-else-if="$profile.settings.public.components.offers.layout === 'list-wide'"
    :items="items"
  />
</template>
