<script setup lang="ts">
import type { SettingsForm, User } from '~~/types/db';

const toast = useToast()

const { user } = defineProps<{
  user: Omit<User, 'lastPaidAt' | 'oneTimePasswordCreatedAt' | 'createdAt' | 'settings'> & {
    lastPaidAt: string | null,
    oneTimePasswordCreatedAt: string | null,
    createdAt: string,
    settings: SettingsForm
  }
  expanded: boolean
}>()

const emit = defineEmits<{
  expand: [void]
  collapse: [void]
}>()

function toggle(isOpen: boolean) {
  if (isOpen) {
    emit('expand')
  } else {
    emit('collapse')
  }
}

const settingsInput = ref<string>(JSON.stringify(user.settings, null, 2))
const showSettings = ref(false)
const isSettingsInputValid = computed(() => {
  try {
    JSON.parse(settingsInput.value)
    return true
  } catch {
    return false
  }
})

async function saveUserSettings() {
  if (!isSettingsInputValid.value) return

  // TODO: implement API endpoint to save user settings

  toast.add({
    title: 'Einstellungen gespeichert',
    icon: 'i-heroicons-check',
    description: `Die Einstellungen für Benutzer ${user.userName} wurden gespeichert.`,
    color: 'success',
    progress: false,
  })

  showSettings.value = false
}
</script>

<template>
  <UCollapsible
    :open="expanded"
    @update:open="toggle"
    class="sm:w-96"
  >
    <UButton
      color="neutral"
      variant="ghost"
      block
      class="rounded-none"
    >
      <template #default>
        <div
          class="size-10 rounded flex items-center justify-center"
          :class="{
            'bg-gray-200 text-xs text-gray-400': user.plan === null,
            'bg-sky-500 text-sky-100': user.plan === 'S',
            'bg-indigo-500 text-indigo-100': user.plan === 'L',
          }"
        >
          {{ user.plan || 'free' }}
        </div>
        <div class="flex flex-col text-left">
          <div>
            {{ user.userName }}
            <span class="text-xs text-gray-500 font-normal">#{{ user.id }}</span>
          </div>
          <div class="text-sm text-gray-500 font-normal">
            {{ user.email }}
          </div>
        </div>
        <UButton
          icon="i-heroicons-cog-6-tooth"
          color="primary"
          variant="ghost"
          class="ml-auto"
          @click.stop="showSettings = true"
        />
        <UIcon
          name="i-lucide-chevron-down"
          class="transition-transform"
          :class="{ 'rotate-180': expanded }"
        />
        <UModal
          v-model:open="showSettings"
          :title="`Benutzer: ${user.userName} #${user.id}`"
          fullscreen
        >
          <template #body>
            <UTextarea
              v-model="settingsInput"
              class="font-mono text-sm w-full h-full"
              :ui="{ base: 'h-full' }"
            />
          </template>

          <template #footer>
            <UBadge
              :label="isSettingsInputValid ? 'JSON korrekt formatiert' : 'JSON fehlerhaft'"
              :color="isSettingsInputValid ? 'success' : 'error'"
              variant="soft"
            />
            <UButton
              label="Schließen"
              variant="soft"
              @click="showSettings = false"
              class="ml-auto"
            />
            <UButton
              label="Speichern"
              :disabled="!isSettingsInputValid"
              @click="saveUserSettings"
            />
          </template>
        </UModal>
      </template>
    </UButton>

    <template #content>
      <div class="flex flex-col gap-2 p-2 text-sm">
        <div>Zuletzt bezahlt: {{ user.lastPaidAt ? new Date(user.lastPaidAt).toLocaleDateString() : 'Nie' }}</div>
        <div>Registriert: {{ new Date(user.createdAt).toLocaleDateString() }}</div>
      </div>
    </template>
  </UCollapsible>
</template>