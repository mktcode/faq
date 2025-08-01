<script setup lang="ts">
const { stripePortalUrl } = useRuntimeConfig().public
const { me } = await useMe()
const { isStartingCheckout, startCheckoutSession } = useCheckoutSession()

const emailToVerify = ref(me.value?.email || '')
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
  <div class="flex flex-col gap-4 p-6">
    <template v-if="me?.isSubscribed">
      <p class="text-gray-600">
        Sie sind bereits für das Abonnement angemeldet. Vielen Dank für Ihre Unterstützung!
      </p>
      <p class="text-gray-600">
        Um Ihr Abonnement zu verwalten, werden Sie zu unserem Zahlungsdienstleister Stripe weitergeleitet.
        Geben Sie dort Ihre E-Mail-Adresse ({{ me.email }}) ein, um einen Zugangscode zu erhalten.
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
      <template v-if="me?.email && !me?.emailConfirmationToken">
        <p class="text-gray-600">
          Mit einem Abonnement erhalten Sie Zugriff auf erweiterte Funktionen und individuellere Gestaltungsmöglichkeiten.
        </p>
        <ul class="list-disc list-inside text-gray-600 mb-6">
          <li>Domain und E-Mail-Adresse inkl.</li>
          <li>Mehr Speicherplatz für Bilder und Downloads</li>
          <li>KI-Assisstent für Anfragen und FAQ</li>
          <li>Premium-Design ab 500 € einmalig</li>
        </ul>
        <div class="flex items-end gap-4 text-2xl">
          <div class="flex flex-col font-bold w-full">
            15 € mtl.
            <span class="text-gray-500 text-sm font-normal">inkl. MwSt.</span>
          </div>
          <div class="flex flex-col gap-2">
            <UButton
              label="Ich brauche nur Domain und E-Mail"
              variant="soft"
            />
            <UButton
              label="Plus abonnieren"
              trailing-icon="i-heroicons-rocket-launch"
              class="w-full"
              :ui="{
                trailingIcon: 'ml-auto',
              }"
              :loading="isStartingCheckout"
              @click="startCheckoutSession"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <p class="text-gray-400">
          Mit einem Abonnement erhalten Sie Zugriff auf erweiterte Funktionen und individuellere Gestaltungsmöglichkeiten.
        </p>
        <ul class="list-disc list-inside text-gray-400">
          <li>Domain und E-Mail-Adresse inkl.</li>
          <li>Mehr Speicherplatz für Bilder und Downloads</li>
          <li>KI-Assisstent für Anfragen und FAQ</li>
          <li>Individuelle Gestaltung verfügbar (ab einmalig 500 €)</li>
        </ul>
        <p class="text-gray-400">
          Bitte geben Sie Ihre E-Mail-Adresse an, um ein Plus-Abonnement abzuschließen.
          Sie bekommen eine E-Mail mit einem Bestätigungslink, um Ihre E-Mail-Adresse zu verifizieren.
          Danach können Sie über unseren Zahlungsdienstleister Stripe ein Abonnement abschließen, monatlich kündbar.
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
