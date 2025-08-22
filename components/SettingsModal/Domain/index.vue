<script setup lang="ts">
const { me } = await useMe()
const emit = defineEmits(['goToSubscription'])
// TODO: implement auth code
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <SettingsModalDomainSubscribed v-if="me?.isSubscribed" />
    <SettingsModalDomainUnsubscribed v-else />
  </div>
</template>
