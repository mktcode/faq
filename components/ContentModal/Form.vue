<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  form: currentSettings.value?.form || {
    title: '',
    description: '',
    successMessage: '',
  },
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
    <UFormField label="Überschrift">
      <UInput
        v-model="form.form.title"
        placeholder="Geben Sie den Titel des Formulars ein"
        class="w-full"
      />
    </UFormField>
    <UFormField label="Beschreibung">
      <UInput
        v-model="form.form.description"
        placeholder="Geben Sie eine Beschreibung für das Formular ein"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Erfolgsnachricht"
      description="Diese Nachricht wird angezeigt, wenn das Formular erfolgreich übermittelt wurde."
    >
      <UInput
        v-model="form.form.successMessage"
        placeholder="z.B. Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen."
        class="w-full"
      />
    </UFormField>
    <UButton
      variant="solid"
      color="primary"
      @click="saveSettings"
    >
      Einstellungen speichern
    </UButton>
  </div>
</template>
