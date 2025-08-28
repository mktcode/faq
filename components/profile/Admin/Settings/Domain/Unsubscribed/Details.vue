<template>
  <p class="text-gray-500">
    Ihre Website ist unter <strong>{{ $profile.domain }}</strong> erreichbar.
    Im Premium-Paket erhalten Sie 3 E-Mail-Postfächer passend zu Ihrer Domain.
  </p>
  <UButton
    label="Premium buchen"
    trailing-icon="i-heroicons-rocket-launch"
    color="primary"
    :ui="{
      trailingIcon: 'ml-auto',
    }"
    @click="$emit('goToSubscription')"
  />
</template>
