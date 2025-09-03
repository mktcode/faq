<template>
  <div class="flex flex-col gap-y-24">
    <TransitionGroup name="list">
      <ProfileMainOfferItem
        v-for="item in $profile.settings.public.components.offers.items"
        :key="item.id"
        :item="item"
      />
    </TransitionGroup>
  </div>
</template>
