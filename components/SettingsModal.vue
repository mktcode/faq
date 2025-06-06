<script setup lang="ts">
const { user } = useUserSession()
const toast = useToast()

const showModal = defineModel('show', {
  default: true,
  type: Boolean,
})

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  title: currentSettings.value?.title || '',
  description: currentSettings.value?.description || '',
  showGoogleReviews: currentSettings.value?.showGoogleReviews || false,
})

async function saveSettings() {
  await $fetch('/api/user/settings', {
    method: 'POST',
    body: form.value,
  })
  toast.add({
    title: 'Einstellungen gespeichert',
    description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
    color: 'success',
  })
  emit('update')
}
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UButton
          icon="i-heroicons-photo"
          variant="soft"
          color="neutral"
          block
          class="size-20 rounded-full mx-auto"
        />
        <div class="flex flex-col gap-2">
          <UButton
            icon="i-heroicons-photo"
            variant="soft"
            color="neutral"
            block
          />
          <div class="flex items-center justify-end gap-2">
            <div class="text-sm text-gray-500">
              Höhe:
            </div>
            <UInputNumber
              :model-value="100"
              placeholder="Höhe"
              size="md"
              class="w-24"
            />
            <USelect
              class="w-32"
              size="md"
              :model-value="'full-width'"
              :items="[
                { label: 'Ganze Breite', value: 'full-width' },
                { label: 'Zentriert', value: 'centered' },
              ]"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-information-circle"
              variant="soft"
            />
            <UInput
              placeholder="https://..."
              class="flex-1"
            />
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              color="neutral"
            />
          </div>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-plus"
              variant="soft"
            />
            <UInput
              placeholder="https://..."
              class="flex-1 opacity-40"
              disabled
            />
          </div>
        </div>
        <UFormField label="Titel">
          <UInput
            v-model="form.title"
            placeholder="Gib den Titel deines Unternehmens ein"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Willkommenstext"
          description="Dieser Text wird auf deiner Profilseite angezeigt."
        >
          <UTextarea
            v-model="form.description"
            placeholder="Gib hier eine kurze Beschreibung deines Unternehmens ein"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="E-Mail"
          description="Diese E-Mail wird für Benachrichtigungen und Anfragen verwendet."
        >
          <UInput
            placeholder="Ihre E-Mail-Adresse"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Telefon"
          description="Diese Nummer wird für Anfragen verwendet."
        >
          <UInput
            placeholder="Ihre Telefonnummer"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Bevorzugter Kontaktweg"
          description="Sollen Interessenten Sie per E-Mail oder lieber per Telefon kontaktieren?"
        >
          <USelect
            class="w-full"
            :items="[
              { label: 'E-Mail', value: 'email' },
              { label: 'Telefon', value: 'phone' },
            ]"
          />
        </UFormField>
        <div class="flex gap-2">
          <ColorPicker />
          <UFormField
            label="Stil"
            class="flex-1"
          >
            <USelect
              class="w-full"
              :items="[
                { label: 'Rund', value: 'round' },
                { label: 'Eckig', value: 'square' },
              ]"
            />
          </UFormField>
        </div>
        <FontPicker />
        <UFormField
          label="Google Bewertungen"
          description="Verbinde dich mit Google und wähle Bewertungen aus, die unter deinem FAQ stehen sollen."
        >
          <USwitch
            v-model="form.showGoogleReviews"
            label="Sterne und Bewertungen anzeigen"
            class="mt-3"
          />
        </UFormField>
        <UButton
          variant="solid"
          color="primary"
          class="mt-4"
          @click="saveSettings"
        >
          Einstellungen speichern
        </UButton>
      </div>
    </template>
  </UModal>
</template>
