<template>
  <div class="my-24 w-full flex flex-col gap-y-24 max-w-lg mx-auto">
    <TransitionGroup name="list">
      <ProfileMainOfferItem
        v-for="item in $profile.settings.public.components.offers.items"
        :key="item.id"
        :item="item"
      />
    </TransitionGroup>
  </div>
</template>
