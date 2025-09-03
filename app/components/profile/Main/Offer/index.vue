<script setup lang="ts">
const { $profile } = useProfile()
</script>

<template>
  <ProfileMainOfferCarousel
    v-if="$profile.settings.public.components.offers.layout === 'carousel'"
  />
  <ProfileMainOfferGrid
    v-else-if="$profile.settings.public.components.offers.layout === 'grid'"
  />
  <ProfileMainOfferList
    v-else-if="$profile.settings.public.components.offers.layout === 'list'"
  />
</template>
