<script setup lang="ts">
const { clear } = useUserSession()

const { $profile } = useProfile()
const { fetch: fetchUserSession } = useUserSession()

const { showMainSettings, showWebsiteSettings, showAssistant, showFeedback } = useAdmin()

async function signOut() {
  showMainSettings.value = false
  $profile.isOwned = false
  $profile.isSubscribed = false
  $profile.mailboxes = []
  await clear()
  fetchUserSession()
}
</script>

<template>
  <div class="fixed w-full top-0 z-20 bg-white p-2 flex gap-1">
    <UButton
      icon="i-heroicons-cog-6-tooth"
      variant="ghost"
      label="Einstellungen"
      @click="showMainSettings = true"
    />
    <UButton
      icon="i-heroicons-globe-alt"
      variant="ghost"
      label="Website"
      @click="showWebsiteSettings = true"
    />
    <UButton
      icon="i-lucide-bot"
      variant="ghost"
      label="Assistent"
      @click="showAssistant = true"
    />
    <UButton
      label="Feedback"
      icon="i-heroicons-chat-bubble-left-right"
      variant="ghost"
      class="ml-auto"
      @click="showFeedback = true"
    />
    <UButton
      label="Abmelden"
      icon="i-heroicons-power"
      variant="ghost"
      @click="signOut"
    />
  </div>
</template>
