<script setup lang="ts">
const { user } = useUserSession()

const emailToVerify = ref(user.value?.email || '')
const isUpdatingEmail = ref(false)
const showEmailVerificationHint = ref(false)

async function updateEmail() {
  isUpdatingEmail.value = true

  await $fetch('/api/user/updateEmail', {
    method: 'POST',
    body: { email: emailToVerify.value },
  })

  showEmailVerificationHint.value = true
  isUpdatingEmail.value = false
}
</script>

<template>
  <p class="text-gray-600">
    Ihre <UIcon name="i-heroicons-building-office-2" class="inline-block size-4 align-middle" /> Unternehmensdaten werden als Rechnungsadresse verwendet.
    Sind Ihre Angaben korrekt?
  </p>
  <UFormField label="Name Ihres Unternehmens">
    <UInput
      v-model="$profile.settings.public.company.name"
      placeholder="Geben Sie den Titel Ihres Unternehmens ein"
      class="w-full"
    />
  </UFormField>
  <UFormField label="Straße und Hausnummer">
    <UInput
      v-model="$profile.settings.public.company.street"
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
        v-model="$profile.settings.public.company.zip"
        placeholder="Postleitzahl"
      />
    </UFormField>
    <UFormField
      label="Stadt"
      class="flex-1"
    >
      <UInput
        v-model="$profile.settings.public.company.city"
        placeholder="Geben Sie die Stadt ein"
        class="w-full"
      />
    </UFormField>
  </div>
  <p class="text-gray-600">
    Geben Sie bitte eine bereits vorhandene E-Mail-Adresse an, z.B. @gmail.com oder @web.de. Wir senden Ihnen eine Bestätigungs-E-Mail zu, in der Sie einen Button "Abonnement abschließen" finden. Darüber gelangen Sie zu unserem Zahlungsdienstleister Stripe und können Ihre Zahlungsinformationen hinterlegen und das Abonnement abschließen.
    Ihre monatliche Rechnung erhalten Sie an diese E-Mail-Adresse.
  </p>
  <UInput
    v-model="emailToVerify"
    label="E-Mail-Adresse"
    type="email"
    placeholder="Ihre E-Mail-Adresse"
    class="w-full"
  />
  <UAlert
    v-if="showEmailVerificationHint"
    title="Bestätigen Sie Ihre E-Mail-Adresse"
    description="Ihre E-Mail-Adresse wurde aktualisiert. Wir haben Ihnen eine E-Mail mit einem Bestätigungslink gesendet. Bitte klicken Sie auf den Link, um Ihre E-Mail-Adresse zu verifizieren."
  />
  <UButton
    label="Bestätigungs-E-Mail senden"
    class="w-full"
    :loading="isUpdatingEmail"
    @click="updateEmail"
  />
</template>