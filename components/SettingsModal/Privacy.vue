<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  privacy: currentSettings.value?.privacy || '',
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
    <UFormField
      label="Datenschutzerklärung"
      description="Hier kannst du zusätzliche Informationen zur Verarbeitung personenbezogener Daten bereitstellen."
    >
      <WysiwygEditor
        v-model="form.privacy"
        placeholder="Hier kannst du deine Datenschutzerklärung eingeben..."
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
