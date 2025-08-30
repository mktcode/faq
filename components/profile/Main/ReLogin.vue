<script setup lang="ts">
const { appHost } = useRuntimeConfig().public
const { ownedUserNames } = useOwnedUsernames()
const $profile = useNuxtApp().$profile
const { loggedIn } = useUserSession()

if ($profile.isOwned && !ownedUserNames.value.includes($profile.username)) {
  ownedUserNames.value.push($profile.username)
}

const showReLoginButton = computed(() => {
  return ownedUserNames.value.includes($profile.username) && !loggedIn.value
})
</script>

<template>
  <div>
    <UButton
      v-if="showReLoginButton"
      variant="ghost"
      class="bg-white/90 hover:bg-white fixed top-2 left-2 z-30"
      label="Wieder Anmelden"
      :href="`https://${appHost}/login?username=${encodeURIComponent($profile.username)}`"
    />
  </div>
</template>
