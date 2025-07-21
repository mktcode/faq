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
    isSmallBusiness: false,
  },
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
      label="Rechtsform"
    >
      <USelect
        :items="[
          { label: 'Freiberufler', value: 'freiberufler' },
          { label: 'Einzelunternehmer', value: 'einzelunternehmer' },
        ]"
        placeholder="Wähle deine Rechtsform"
        class="w-full"
      />
    </UFormField>
    <UFormField
      label="Kleinunternehmerregelung"
      description="Wenn du die Kleinunternehmerregelung in Anspruch nimmst, musst du keine Umsatzsteuer ausweisen."
    >
      <USwitch
        v-model="form.company.isSmallBusiness"
        label="Ich bin Kleinunternehmer"
        class="w-full"
      />
    </UFormField>
    <Transition name="fade">
      <UFormField
        v-if="!form.company.isSmallBusiness"
        label="Umsatzsteuer-ID oder Wirtschafts-ID"
        description="Gib hier nicht deine persönliche Steuernummer (123/456/78901) an!"
      >
        <UInput
          v-model="form.company.taxId"
          placeholder="DE123456789"
          class="w-full"
        />
      </UFormField>
    </Transition>
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
