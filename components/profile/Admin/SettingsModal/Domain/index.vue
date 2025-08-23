<script setup lang="ts">
const emit = defineEmits(['goToSubscription'])
// TODO: implement auth code
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <ProfileAdminSettingsModalDomainSubscribed v-if="$profile.isSubscribed" />
    <ProfileAdminSettingsModalDomainUnsubscribed
      v-else
      @go-to-subscription="$emit('goToSubscription')"
    />
  </div>
</template>
