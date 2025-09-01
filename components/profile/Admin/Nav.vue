<script setup lang="ts">
const { clear } = useUserSession()

const { $profile } = useProfile()
const { fetch: fetchUserSession } = useUserSession()

const { go } = useAdmin()

async function signOut() {
  go('#')
  $profile.isOwned = false
  $profile.subscription.plan = null
  $profile.subscription.checkoutPending = false
  $profile.subscription.paid = false
  $profile.mailboxes = []
  await clear()
  fetchUserSession()
}
</script>

<template>
  <div class="fixed w-full bottom-0 md:bottom-auto md:top-0 z-20 bg-white/90 saturate-150 backdrop-blur-lg p-2 flex gap-1 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
    <UButton
      icon="i-heroicons-cog-6-tooth"
      variant="ghost"
      label="Einstellungen"
      :ui="{
        label: 'hidden md:inline-block',
      }"
      @click="go('#settings')"
    />
    <UButton
      icon="i-lucide-monitor-smartphone"
      variant="ghost"
      label="Website"
      :ui="{
        label: 'hidden md:inline-block',
      }"
      @click="go('#website')"
    />
    <UButton
      icon="i-lucide-bot"
      variant="ghost"
      label="Assistent"
      :ui="{
        label: 'hidden md:inline-block',
      }"
      @click="go('#assistant')"
    />
    <UButton
      label="Hilfe"
      icon="i-lucide-message-circle-question-mark"
      variant="ghost"
      class="ml-auto"
      :ui="{
        label: 'hidden md:inline-block',
      }"
      @click="go('#support')"
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
</template>
