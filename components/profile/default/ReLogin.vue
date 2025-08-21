<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

const { appHost } = useRuntimeConfig().public
const { me } = await useMe()
const { username, isOwned } = await useProfile()
const ownedUserNames = useLocalStorage<string[]>('ownedUserNames', [])

if (isOwned && username.value && !ownedUserNames.value.includes(username.value)) {
  ownedUserNames.value.push(username.value)
}

const showReLoginButton = computed(() => {
  return username.value && ownedUserNames.value.includes(username.value) && !me.value
})
</script>

<template>
  <div>
    <UButton
      v-if="showReLoginButton && username"
      variant="ghost"
      class="bg-white/90 hover:bg-white fixed top-2 left-2 z-30"
      label="Anmelden"
      :href="`https://${appHost}/login?username=${encodeURIComponent(username)}`"
    />
  </div>
</template>