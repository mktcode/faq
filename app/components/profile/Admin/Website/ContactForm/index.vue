<script setup lang="ts">
import type { FormComponentSchema } from '~~/types/db';

defineProps<{
  component: FormComponentSchema;
}>()
</script>

<template>
  <UFormField label="Überschrift">
    <UInput
      v-model="component.title"
      placeholder="Geben Sie den Titel des Formulars ein"
      class="w-full"
    />
  </UFormField>
  <UFormField label="Beschreibung">
    <UInput
      v-model="component.description"
      placeholder="Geben Sie eine Beschreibung für das Formular ein"
      class="w-full"
    />
  </UFormField>
  <UFormField
    label="Erfolgsmeldung"
    description="Wird angezeigt, wenn das Formular erfolgreich übermittelt wurde."
  >
    <UInput
      v-model="component.successMessage"
      placeholder="z.B. Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen."
      class="w-full"
    />
  </UFormField>
  <UFormField
    label="Fehlermeldung"
    description="Wird angezeigt, wenn beim Senden des Formulars ein Fehler aufgetreten ist. In diesem Fall wird auch ein Link zum Impressum angezeigt."
  >
    <UInput
      v-model="component.errorMessage"
      placeholder="z.B. Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Versuchen Sie es bitte später erneut oder per Telefon oder E-Mail."
      class="w-full"
    />
  </UFormField>
  <ProfileAdminWebsiteContactFormFields v-model:fields="component.fields" />
</template>
