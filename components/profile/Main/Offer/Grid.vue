<template>
  <div class="my-24 w-full flex flex-wrap items-start justify-center gap-x-16 gap-y-24">
    <TransitionGroup name="list">
      <ProfileMainOfferItem
        v-for="item in $profile.settings.public.components.offers.items"
        :key="item.id"
        :item="item"
      />
    </TransitionGroup>
  </div>
</template>
