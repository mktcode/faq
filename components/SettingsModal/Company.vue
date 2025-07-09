<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const form = ref({
  company: currentSettings.value?.company || {
    name: '',
    street: '',
    zip: '',
    city: '',
    phone: '',
    email: '',
    taxId: '',
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
    <UFormField label="Name Ihres Unternehmens">
      <UInput
        v-model="form.company.name"
        placeholder="Geben Sie den Titel Ihres Unternehmens ein"
        class="w-full"
      />
    </UFormField>
    <UFormField label="Straße und Hausnummer">
      <UInput
        v-model="form.company.street"
        placeholder="Geben Sie die Straße und Hausnummer ein"
        class="w-full"
      />
    </UFormField>
    <div class="flex flex-col sm:flex-row gap-4">
      <UFormField
        label="PLZ"
        class="w-32"
      >
        <UInput
          v-model="form.company.zip"
          placeholder="Postleitzahl"
        />
      </UFormField>
      <UFormField
        label="Stadt"
        class="flex-1"
      >
        <UInput
          v-model="form.company.city"
          placeholder="Geben Sie die Stadt ein"
          class="w-full"
        />
      </UFormField>
    </div>
    <UFormField label="Telefonnummer">
      <UInput
        v-model="form.company.phone"
        placeholder="Geben Sie die Telefonnummer ein"
        class="w-full"
      />
    </UFormField>
    <UFormField label="E-Mail-Adresse">
      <UInput
        v-model="form.company.email"
        type="email"
        placeholder="Geben Sie die E-Mail-Adresse ein"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Umsatzsteuer-ID"
      description="Gibst du keine an, wird im Impressum auf die Kleinunternehmerregelung hingewiesen."
    >
      <UInput
        v-model="form.company.taxId"
        placeholder="Geben Sie Ihre Steuernummer ein"
        class="w-full"
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
