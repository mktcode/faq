<script setup lang="ts">
import type { FormComponentSchema } from '~~/types/db';

defineProps<{
  component: FormComponentSchema;
}>()
</script>

<template>
  <div class="w-full flex flex-col gap-4 p-4">
    <div class="flex items-center gap-4 mb-4">
      <UFormField
        label="Titel der Sektion"
        class="flex-1"
      >
        <UInput
          v-model="component.title"
          placeholder="z.B. Kontakt"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Sichtbar">
        <USwitch
          v-model="component.showTitle"
          size="xl"
        />
      </UFormField>
    </div>

    <UFormField label="Beschreibung" hint="(optional)">
      <WysiwygEditor v-model="component.description" />
    </UFormField>
    
    <UFormField
      label="Erfolgsmeldung"
      description="Wird angezeigt, wenn das Formular erfolgreich übermittelt wurde."
    >
      <UTextarea
        v-model="component.successMessage"
        placeholder="z.B. Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen."
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Fehlermeldung"
      description="Wird angezeigt, wenn beim Senden des Formulars ein Fehler aufgetreten ist. In diesem Fall wird auch ein Link zum Impressum angezeigt."
    >
      <UTextarea
        v-model="component.errorMessage"
        placeholder="z.B. Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Versuchen Sie es bitte später erneut oder per Telefon oder E-Mail."
        class="w-full"
      />
    </UFormField>
    <ProfileAdminWebsiteContactFormFields v-model:fields="component.fields" />
  </div>
</template>
