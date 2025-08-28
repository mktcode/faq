<script setup lang="ts">
const { saveSettings, isSavingSettings } = useProfile()
const { showContactFormSettings, showWebsiteSettings, showDelayed } = useAdmin()
</script>

<template>
  <UDrawer
    v-model:open="showContactFormSettings"
    side="left"
    close-icon="i-heroicons-arrow-left"
    handle-only
    direction="left"
    :overlay="false"
    :close-threshold="0.85"
    :close="{
      size: 'md',
    }"
    :ui="{
      content: 'shadow-2xl shadow-black',
      container: 'relative max-w-md no-scrollbar',
      handle: '!bg-gray-400',
      header: 'h-10',
      body: 'flex flex-col gap-4',
    }"
    @close="showDelayed(() => showWebsiteSettings = true)"
  >
    <template #header>
      <ProfileMainDrawerTip />
      <h3 class="text-lg font-semibold flex gap-2">
        <UIcon
          name="i-heroicons-envelope"
          class="inline-block size-6 opacity-50"
        />
        Kontaktformular
        <ProfileAdminSaveAndReset />
      </h3>
    </template>

    <template #body>
      <UFormField label="Überschrift">
        <UInput
          v-model="$profile.settings.public.components.form.title"
          placeholder="Geben Sie den Titel des Formulars ein"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Beschreibung">
        <UInput
          v-model="$profile.settings.public.components.form.description"
          placeholder="Geben Sie eine Beschreibung für das Formular ein"
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Erfolgsmeldung"
        description="Wird angezeigt, wenn das Formular erfolgreich übermittelt wurde."
      >
        <UInput
          v-model="$profile.settings.public.components.form.successMessage"
          placeholder="z.B. Vielen Dank für Ihre Anfrage. Wir melden uns zeitnah bei Ihnen."
          class="w-full"
        />
      </UFormField>
      <UFormField
        label="Fehlermeldung"
        description="Wird angezeigt, wenn beim Senden des Formulars ein Fehler aufgetreten ist. In diesem Fall wird auch ein Link zum Impressum angezeigt."
      >
        <UInput
          v-model="$profile.settings.public.components.form.errorMessage"
          placeholder="z.B. Beim Senden Ihrer Anfrage ist ein Fehler aufgetreten. Versuchen Sie es bitte später erneut oder per Telefon oder E-Mail."
          class="w-full"
        />
      </UFormField>
      <ProfileAdminWebsiteFormFields v-model:fields="$profile.settings.public.components.form.fields" />
      <UButton
        label="Einstellungen speichern"
        variant="solid"
        color="primary"
        :loading="isSavingSettings"
        @click="saveSettings"
      />
    </template>
  </UDrawer>
</template>