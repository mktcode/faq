<script setup lang="ts">
const { showLegalDataWarning, isSubscribed, refreshSettings } = await useProfile()

const { clear } = useUserSession()
const { refreshMe } = await useMe()

const showMenu = ref(false)
const showSettingsModal = useState('showSettingsModal', () => false)
const showDesignModal = useState('showDesignModal', () => false)
const showContentModal = useState('showContentModal', () => false)
const showFeedbackModal = useState('showFeedbackModal', () => false)
const showAssistantModal = useState('showAssistantModal', () => false)

function closeAndOpenDesign() {
  showMenu.value = false
  setTimeout(() => {
    showDesignModal.value = true
  }, 500)
}

function closeAndOpenContent() {
  showMenu.value = false
  setTimeout(() => {
    showContentModal.value = true
  }, 500)
}

async function signOut() {
  await clear()
  refreshMe()
}
</script>

<template>
  <USlideover
    v-model:open="showMenu"
    title="Menü"
    side="left"
    :close="{
      size: 'md',
    }"
    :ui="{
      body: '!p-0',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <UButton
      icon="i-heroicons-bars-3"
      variant="ghost"
      class="bg-white/90 hover:bg-white fixed top-2 left-2 z-10"
      label="Menü"
    />

    <template #body>
      <UButton
        label="Einstellungen"
        icon="i-heroicons-cog-6-tooth"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="showSettingsModal = true"
      />

      <UButton
        label="Design anpassen"
        icon="i-heroicons-paint-brush"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="closeAndOpenDesign"
      />

      <UButton
        label="Inhalt und Funktion"
        icon="i-lucide-letter-text"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="closeAndOpenContent"
      />

      <UButton
        label="Assistent"
        icon="i-lucide-bot"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="showAssistantModal = true"
        :disabled="!isSubscribed"
      >
        <template #trailing>
          <UBadge
            v-if="!isSubscribed"
            label="Premium"
            variant="outline"
            class="ml-auto"
          />
        </template>
      </UButton>

      <AssistantModal />
      <SettingsModal @update="refreshSettings" />
    </template>

    <template #footer>
      <UButton
        label="Feedback"
        icon="i-heroicons-chat-bubble-left-right"
        @click="showMenu = false; showFeedbackModal = true"
      />
      <UButton
        label="Abmelden"
        icon="i-heroicons-power"
        variant="ghost"
        @click="signOut"
      />
    </template>
  </USlideover>
</template>
