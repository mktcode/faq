<script setup lang="ts">
const { clear } = useUserSession()
const toast = useToast()

const { $profile } = useProfile()

const showMenu = ref(false)
const showSettingsModal = useState('showSettingsModal', () => false)
const showDesignModal = useState('showDesignModal', () => false)
const showContentModal = useState('showContentModal', () => false)
const showFeedbackModal = useState('showFeedbackModal', () => false)
const showAssistantModal = useState('showAssistantModal', () => false)

const showLegalDataWarning = computed(() => {
  return !$profile.settings.public.company.name || !$profile.settings.public.company.street || !$profile.settings.public.company.phone
})

async function togglePublished() {
  const { published } = await $fetch('/api/user/togglePublished', { method: 'POST' })

  if (published) {
    toast.add({
      title: 'Profil veröffentlicht',
      description: `Dein Profil ist jetzt öffentlich zugänglich.`,
      color: 'success',
    })
  }
  else {
    toast.add({
      title: 'Profil nicht mehr veröffentlicht',
      description: `Dein Profil ist jetzt privat.`,
      color: 'warning',
    })
  }
}

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
      <UAlert
        v-if="showLegalDataWarning"
        variant="soft"
        title="Unternehmensdaten vervollständigen"
        icon="i-heroicons-exclamation-triangle"
        class="rounded-none"
      >
        <template #description>
          Damit wir Ihre Website veröffentlichen können, benötigen wir noch einige Angaben für das Impressum und die Datenschutzerklärung. Bitte tragen Sie dazu Ihre
          <UIcon
            name="i-heroicons-building-office-2"
            class="inline-block size-4 align-middle"
          /> <strong>Unternehmensdaten</strong> vollständig ein.
        </template>
      </UAlert>
      <div class="p-4 border-b border-gray-200">
        <USwitch
          v-model="$profile.isPublic"
          :disabled="showLegalDataWarning"
          label="Veröffentlicht"
          :description="$profile.isPublic ? 'Ihre Website ist öffentlich zugänglich.' : 'Nur Sie können Ihr Profil sehen, wenn Sie angemeldet sind.'"
          @update:model-value="togglePublished"
        />
      </div>
      <UButton
        label="Einstellungen"
        icon="i-heroicons-cog-6-tooth"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="showSettingsModal = true"
      />

      <UButton
        label="Design & Kopfbereich"
        icon="i-heroicons-paint-brush"
        class="w-full rounded-none p-4 border-b border-gray-200"
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

      <UButton
        label="Assistent"
        icon="i-lucide-bot"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        :disabled="!$profile.isSubscribed"
        @click="showAssistantModal = true"
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

      <ProfileAdminAssistantModal />
      <ProfileAdminAssistantModalResearch />
      <ProfileAdminSettingsModal />
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
