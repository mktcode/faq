<script setup lang="ts">
const { stripePortalUrl } = useRuntimeConfig().public
const { isStartingCheckout, startCheckoutSession } = useCheckoutSession()
const { user } = useUserSession()

const { saveSettings, isSavingSettings } = useProfile()

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

async function saveAndStartCheckout() {
  await saveSettings()
  startCheckoutSession()
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <template v-if="$profile.isSubscribed">
      <p class="text-gray-600">
        Sie sind bereits für das Abonnement angemeldet. Vielen Dank für Ihre Unterstützung!
      </p>
      <p class="text-gray-600">
        Um Ihr Abonnement zu verwalten, werden Sie zu unserem Zahlungsdienstleister Stripe weitergeleitet.
        Geben Sie dort Ihre E-Mail-Adresse ({{ user?.email }}) ein, um einen Zugangscode zu erhalten.
        Aus Sicherheitsgründen ist dieser Code nur einmalig gültig.
      </p>
      <UButton
        :to="stripePortalUrl"
        label="Abonnement verwalten"
        icon="i-heroicons-pencil-square"
        class="w-full"
      />
    </template>
    <template v-else>
      <template v-if="user?.email && !user?.emailConfirmationToken">
        <div class="text-center border border-gray-200 p-4 rounded-xl">
          <div class="flex items-baseline justify-center gap-2 mb-2">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">17,85 €</span>
            <span class="text-lg text-gray-600">/Monat</span>
          </div>
          <div class="text-sm text-gray-500 mb-1">
            15 € Netto + 2,85 € Umsatzsteuer
          </div>
          <p class="text-sm text-gray-500 mt-2">
            Keine einmaligen Kosten • Monatlich kündbar
          </p>
        </div>
        <div class="flex flex-col gap-2">
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
        </div>
        <UButton
          label="Abonnement abschließen"
          trailing-icon="i-heroicons-rocket-launch"
          class="w-full"
          :ui="{
            trailingIcon: 'ml-auto',
          }"
          :loading="isStartingCheckout || isSavingSettings"
          @click="saveAndStartCheckout"
        />
      </template>
      <template v-else>
        <div class="text-center border border-gray-200 p-4 rounded-xl">
          <div class="flex items-baseline justify-center gap-2 mb-2">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">17,85 €</span>
            <span class="text-lg text-gray-600">/Monat</span>
          </div>
          <div class="text-sm text-gray-500 mb-1">
            15 € Netto + 2,85 € Umsatzsteuer
          </div>
          <p class="text-sm text-gray-500 mt-2">
            Keine einmaligen Kosten • Monatlich kündbar
          </p>
        </div>
        <p class="text-gray-600">
          Ihre monatliche Rechnung erhalten Sie per E-Mail. Geben Sie dazu bitte eine vorhandene E-Mail-Adresse an und bestätigen Sie diese, in dem Sie auf den Link klicken, den wir Ihnen zusenden.
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
          label="E-Mail verifizieren"
          class="w-full"
          :loading="isUpdatingEmail"
          @click="updateEmail"
        />
      </template>
    </template>
  </div>
</template>
