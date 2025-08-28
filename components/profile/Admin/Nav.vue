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

const isSupportChatOpen = ref(false)

function toggleSupportChat() {
  const bubble = document.querySelector('.woot-widget-bubble')
  if (bubble instanceof HTMLElement) {
    bubble.click()
    const holder = document.querySelector('#cw-widget-holder')
    if (holder instanceof HTMLElement) {
      isSupportChatOpen.value = !holder.classList.contains('woot--hide')
    }
  }
}
</script>

<template>
  <ClientOnly>
    <div class="fixed w-full bottom-0 md:bottom-auto md:top-0 z-20 bg-white/90 saturate-150 backdrop-blur-lg p-2 flex gap-1 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
      <UButton
        icon="i-heroicons-cog-6-tooth"
        variant="ghost"
        label="Einstellungen"
        @click="showMainSettings = true"
        :ui="{
          label: 'hidden md:inline-block'
        }"
      />
      <UButton
        icon="i-lucide-monitor-smartphone"
        variant="ghost"
        label="Website"
        @click="showWebsiteSettings = true"
        :ui="{
          label: 'hidden md:inline-block'
        }"
      />
      <UButton
        icon="i-lucide-bot"
        variant="ghost"
        label="Assistent"
        @click="showAssistant = true"
        :ui="{
          label: 'hidden md:inline-block'
        }"
      />
      <UButton
        :label="isSupportChatOpen ? 'Hilfe schließen' : 'Hilfe'"
        :icon="isSupportChatOpen ? 'i-heroicons-x-mark' : 'i-lucide-message-circle-question-mark'"
        variant="ghost"
        class="ml-auto"
        @click="toggleSupportChat"
        :ui="{
          label: 'hidden md:inline-block'
        }"
      />
      <UButton
        label="Feedback"
        icon="i-lucide-message-circle-warning"
        variant="ghost"
        @click="showFeedback = true"
        :ui="{
          label: 'hidden md:inline-block'
        }"
      />
      <UButton
        label="Abmelden"
        icon="i-heroicons-power"
        variant="ghost"
        @click="signOut"
        :ui="{
          label: 'hidden md:inline-block'
        }"
      />
    </div>
  </ClientOnly>
</template>
