<script setup lang="ts">
const { clear } = useUserSession()

const { $profile } = useProfile()
const { fetch: fetchUserSession } = useUserSession()

const { showMainSettings, showWebsiteSettings, showAssistant, showSupport } = useAdmin()

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
  <ClientOnly>
    <div class="fixed w-full bottom-0 md:bottom-auto md:top-0 z-20 bg-white/90 saturate-150 backdrop-blur-lg p-2 flex gap-1 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      <UButton
        icon="i-heroicons-cog-6-tooth"
        variant="ghost"
        label="Einstellungen"
        :ui="{
          label: 'hidden md:inline-block',
        }"
        @click="showMainSettings = true"
      />
      <UButton
        icon="i-lucide-monitor-smartphone"
        variant="ghost"
        label="Website"
        :ui="{
          label: 'hidden md:inline-block',
        }"
        @click="showWebsiteSettings = true"
      />
      <UButton
        icon="i-lucide-bot"
        variant="ghost"
        label="Assistent"
        :ui="{
          label: 'hidden md:inline-block',
        }"
        @click="showAssistant = true"
      />
      <UButton
        label="Hilfe"
        icon="i-lucide-message-circle-question-mark"
        variant="ghost"
        class="ml-auto"
        :ui="{
          label: 'hidden md:inline-block',
        }"
        @click="showSupport = true"
      />
      <UButton
        label="Abmelden"
        icon="i-heroicons-power"
        variant="ghost"
        :ui="{
          label: 'hidden md:inline-block',
        }"
        @click="signOut"
      />
    </div>
  </ClientOnly>
</template>
