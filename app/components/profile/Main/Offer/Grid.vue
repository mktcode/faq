<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
    <TransitionGroup name="list">
      <ProfileMainOfferItem
        v-for="item in $profile.settings.public.components.offers.items"
        :key="item.id"
        :item="item"
      />
    </TransitionGroup>
  </div>
</template>
