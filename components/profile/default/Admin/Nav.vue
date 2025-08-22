<script setup lang="ts">
const { clear } = useUserSession()

const showMenu = ref(false)
const showSettingsModal = useState('showSettingsModal', () => false)
const showDesignModal = useState('showDesignModal', () => false)
const showContentModal = useState('showContentModal', () => false)
const showFeedbackModal = useState('showFeedbackModal', () => false)
const showAssistantModal = useState('showAssistantModal', () => false)
const showAssistantResearchModal = useState('showAssistantResearchModal', () => false)

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
}
</script>

<template>
  <USlideover
    v-model:open="showMenu"
    title="Administration"
    side="left"
    :close="{
      size: 'md',
    }"
    :ui="{
      wrapper: 'z-40',
      body: '!p-0',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <UButton
      icon="i-heroicons-bars-3"
      variant="ghost"
      class="bg-white/90 hover:bg-white fixed top-2 left-2 z-10"
      label="Administration"
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

      <div class="px-4 pt-6 pb-2 flex gap-2 items-center text-sm text-gray-500">
        <UIcon
          name="i-heroicons-computer-desktop"
          class="size-5"
        />
        Website
      </div>

      <UButton
        label="Design & Kopfbereich"
        icon="i-heroicons-paint-brush"
        class="w-full rounded-none p-4 border-y border-gray-200"
        variant="ghost"
        color="neutral"
        @click="closeAndOpenDesign"
      />

      <UButton
        label="Inhalt und Funktion"
        icon="i-lucide-layout-template"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="closeAndOpenContent"
      />

      <div class="px-4 pt-6 pb-2 flex gap-2 items-center text-sm text-gray-500">
        <UIcon
          name="i-lucide-bot"
          class="size-5"
        />
        Assistent
      </div>

      <UButton
        label="Recherche"
        icon="i-lucide-search"
        class="w-full rounded-none p-4 border-y border-gray-200"
        variant="ghost"
        color="neutral"
        :disabled="!$profile.isSubscribed"
        @click="showAssistantResearchModal = true"
      >
        <template #trailing>
          <UBadge
            v-if="!$profile.isSubscribed"
            label="Premium"
            variant="outline"
            class="ml-auto"
          />
        </template>
      </UButton>

      <UButton
        label="Textbearbeitung"
        icon="i-lucide-letter-text"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        disabled
      >
        <template #trailing>
          <UBadge
            v-if="!$profile.isSubscribed"
            label="Premium"
            variant="outline"
            class="ml-auto"
          />
          <UBadge
            v-else
            label="In Arbeit"
            variant="outline"
            class="ml-auto"
          />
        </template>
      </UButton>

      <UButton
        label="IT-Support"
        icon="i-lucide-cable"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        disabled
      >
        <template #trailing>
          <UBadge
            v-if="!$profile.isSubscribed"
            label="Premium"
            variant="outline"
            class="ml-auto"
          />
          <UBadge
            v-else
            label="In Arbeit"
            variant="outline"
            class="ml-auto"
          />
        </template>
      </UButton>

      <AssistantModal />
      <AssistantModalResearch />
      <SettingsModal />
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
