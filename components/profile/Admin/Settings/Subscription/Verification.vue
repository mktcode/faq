<script setup lang="ts">
const { user } = useUserSession()

const { $profile, updateProfile } = useProfile()
const { showSubscriptionVerification, go } = useAdmin()
const selectedSubscription = useState<'S' | 'L' | null>('selectedSubscription', () => null)

const emailToVerify = ref(user.value?.email || '')
const isStartingVerification = ref(false)
const showEmailVerificationHint = ref(false)

const cooldown = ref(0)

const updateProfileInterval = ref<NodeJS.Timeout | null>(null)

async function startVerification() {
  isStartingVerification.value = true

  await $fetch('/api/user/startVerification', {
    method: 'POST',
    body: {
      email: emailToVerify.value,
      company: $profile.settings.public.company,
      subscription: selectedSubscription.value,
    },
  })

  showEmailVerificationHint.value = true
  isStartingVerification.value = false

  cooldown.value = 30
  const interval = setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)

  updateProfileInterval.value = setInterval(async () => {
    await updateProfile()
  }, 5000)
}

onBeforeUnmount(() => {
  if (updateProfileInterval.value) {
    clearInterval(updateProfileInterval.value)
  }
})
</script>

<template>
  <USlideover
    :open="showSubscriptionVerification"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: 'flex flex-col gap-4',
    }"
    :close="{
      size: 'md',
      onClick: () => {
        go('#settings/subscription')
      }
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-rocket-launch"
          class="inline-block size-6 opacity-50"
        />
        Angaben bestätigen
      </h3>
    </template>

    <template #body>
      <p class="text-gray-600">
        Ihre <UIcon
          name="i-heroicons-building-office-2"
          class="inline-block size-4 align-middle"
        /> Unternehmensdaten werden als Rechnungsadresse verwendet.
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
      <!-- TODO: Height needs to be fixed on mobile -->
      <UAlert
        v-if="showEmailVerificationHint"
        icon="i-lucide-loader-circle"
        title="Öffnen Sie Ihr E-Mail-Postfach"
        description="Sie haben eine E-Mail erhalten, um Ihr Abonnement zu bestätigen. Lassen Sie dieses Fenster geöffnet und kehren Sie nach der Zahlung zurück."
        :ui="{
          icon: 'animate-spin',
        }"
      />
      <UButton
        :label="showEmailVerificationHint ? `Bestätigungs-E-Mail erneut senden${cooldown > 0 ? ` (${cooldown})` : ''}` : `Bestätigungs-E-Mail senden`"
        class="w-full"
        :loading="isStartingVerification"
        :disabled="isStartingVerification || cooldown > 0"
        @click="startVerification"
      />
    </template>
  </USlideover>
</template>
