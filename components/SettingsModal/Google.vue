<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
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
  <div class="flex flex-col gap-4 p-6">
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
