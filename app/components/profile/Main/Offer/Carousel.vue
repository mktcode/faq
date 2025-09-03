<template>
  <div>
    <UCarousel
      v-if="$profile.settings.public.components.offers.items.length > 1"
      v-slot="{ item }"
      :dots="$profile.settings.public.components.offers.items.length > 1"
      :arrows="$profile.settings.public.components.offers.items.length > 1"
      auto-height
      :prev="{ variant: 'ghost', color: 'primary', size: 'xl', icon: 'i-heroicons-chevron-left-solid', class: 'disabled:hidden' }"
      :next="{ variant: 'ghost', color: 'primary', size: 'xl', icon: 'i-heroicons-chevron-right-solid', class: 'disabled:hidden' }"
      :autoplay="{ delay: 20000 }"
      :items="$profile.settings.public.components.offers.items"
      class="w-full"
      :ui="{
        container: 'transition-[height] duration-500 ease-in-out',
      }"
    >
      <ProfileMainOfferItem :item="item" />
    </UCarousel>
    <ProfileMainOfferItem
      v-else-if="$profile.settings.public.components.offers.items.length === 1"
      :item="$profile.settings.public.components.offers.items[0]"
    />
  </div>
</template>
