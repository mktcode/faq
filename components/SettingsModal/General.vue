<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  title: currentSettings.value?.title || '',
  description: currentSettings.value?.description || '',
  preferredContactMethod: currentSettings.value?.preferredContactMethod || 'none',
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
  <div class="flex flex-col gap-4 p-6">
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
      label="Bevorzugter Kontaktweg"
      description="Sollen Interessenten Sie per E-Mail oder lieber per Telefon kontaktieren?"
    >
      <USelect
        v-model="form.preferredContactMethod"
        class="w-full"
        :items="[
          { label: 'E-Mail', value: 'email' },
          { label: 'Telefon', value: 'phone' },
          { label: 'Beides', value: 'none' },
        ]"
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
