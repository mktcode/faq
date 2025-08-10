<script setup lang="ts">
const { showLegalDataWarning, refreshSettings } = await useProfile()

const showMenu = ref(false)
const showSettingsModal = useState('showSettingsModal', () => false)
const showDesignModal = useState('showDesignModal', () => false)
const showContentModal = useState('showContentModal', () => false)
const showFeedbackModal = useState('showFeedbackModal', () => false)

function closeAndOpenDesign() {
  showMenu.value = false
  setTimeout(() => {
    showDesignModal.value = true
  }, 600)
}

function closeAndOpenContent() {
  showMenu.value = false
  setTimeout(() => {
    showContentModal.value = true
  }, 600)
}
</script>

<template>
  <USlideover
    title="Menü"
    side="left"
    v-model:open="showMenu"
    :close="{
      size: 'md'
    }"
    :ui="{
      body: '!p-0',
      overlay: 'backdrop-blur-xs',
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
        class="w-full rounded-none p-4"
        variant="ghost"
        color="neutral"
        @click="closeAndOpenContent"
      />

      <SettingsModal @update="refreshSettings" />
    </template>

    <template #footer>
      <UButton
        label="Feedback"
        variant="ghost"
        icon="i-heroicons-chat-bubble-left-right"
        @click="showMenu = false; showFeedbackModal = true"
      />
    </template>
  </USlideover>
</template>
