<script setup lang="ts">
const { settings, saveSettings } = await useProfile()

const form = ref({
  form: {
    title: settings.value?.form?.title || '',
    description: settings.value?.form?.description || '',
    successMessage: settings.value?.form?.successMessage || '',
    errorMessage: settings.value?.form?.errorMessage || '',
    fields: settings.value?.form?.fields || [],
  },
})
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
    <ContentModalFormFields v-model:fields="form.form.fields" />
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
    <UFormField
      label="Fehlernachricht"
      description="Diese Nachricht wird angezeigt, wenn beim Senden des Formulars ein Fehler aufgetreten ist. In diesem Fall wird auch ein Link zum Impressum angezeigt."
    >
      <UInput
        v-model="form.form.errorMessage"
        placeholder="z.B. Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Versuchen Sie es bitte später erneut oder per Telefon oder E-Mail."
        class="w-full"
      />
    </UFormField>
    <UButton
      variant="solid"
      color="primary"
      @click="() => saveSettings(form)"
    >
      Einstellungen speichern
    </UButton>
  </div>
</template>
