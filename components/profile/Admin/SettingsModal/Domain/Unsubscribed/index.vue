<script setup lang="ts">
const emit = defineEmits(['goToSubscription'])
</script>

<template>
  <ProfileAdminSettingsModalDomainUnsubscribedDetails
    v-if="$profile.domain"
    @go-to-subscription="$emit('goToSubscription')"
  />
  <ProfileAdminSettingsModalDomainUnsubscribedSetup
    v-else
    @go-to-subscription="$emit('goToSubscription')"
  />
</template>