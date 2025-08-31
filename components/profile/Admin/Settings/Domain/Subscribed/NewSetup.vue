<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const newDomain = ref('')
watch(newDomain, () => isTyping.value = true)
watchDebounced(newDomain, () => isTyping.value = false, { debounce: 600 })
watchDebounced(newDomain, checkDomainAvailability, { debounce: 500 })

const toast = useToast()

const { $profile, updateProfile, isUpdatingProfile } = useProfile()

// TODO: improve domain validation
const isDomainValid = computed(() => /^[A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9]$/.test(newDomain.value)) // without tld!
const isCheckingDomain = ref(false)
const isAvailable = ref(false)
const isTyping = ref(false)
const customerHasConfirmedDomain = ref(false)
const isRegisteringDomain = ref(false)
const registeredSuccessfully = ref(false)

async function checkDomainAvailability() {
  isAvailable.value = false
  if (!isDomainValid.value) {
    return
  }

  isCheckingDomain.value = true

  try {
    const checkResult = await $fetch('/api/user/checkDomainAvailability', {
      method: 'POST',
      body: { domain: newDomain.value + '.de' },
    })

    isAvailable.value = checkResult.isAvailable
    isCheckingDomain.value = false
  }
  catch (error) {
    toast.add({
      title: 'Unbekannter Fehler',
      description: 'Die Verfügbarkeit der Domain konnte nicht überprüft werden. Bitte kontaktieren Sie uns.',
      color: 'error',
    })
    isAvailable.value = false
  }
  finally {
    isCheckingDomain.value = false
  }
}

async function registerDomain() {
  if (!isDomainValid.value || isCheckingDomain.value || !isAvailable.value) {
    return
  }

  isRegisteringDomain.value = true
  const domainToRegister = newDomain.value + '.de'

  try {
    await $fetch('/api/user/registerDomain', {
      method: 'POST',
      body: { domain: domainToRegister },
    })

    $profile.domain = domainToRegister
    $profile.domainIsExternal = false
    registeredSuccessfully.value = true
  }
  catch (error) {
    toast.add({
      title: 'Unbekannter Fehler',
      description: 'Die Domain konnte nicht registriert werden. Bitte kontaktieren Sie uns.',
      color: 'error',
    })
  }
  finally {
    isRegisteringDomain.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UFormField label="Neue .de-Domain registrieren">
      <UButtonGroup class="w-full">
        <UInput
          v-model="newDomain"
          placeholder="ihre-domain"
          class="w-full"
          size="xxl"
          :disabled="isCheckingDomain || isRegisteringDomain || registeredSuccessfully || !$profile.subscription.paid"
        />
        <UBadge
          label=".de"
          color="neutral"
          variant="soft"
          size="xl"
          :ui="{
            base: 'px-4',
          }"
        />
        <UBadge
          v-if="isCheckingDomain"
          icon="i-lucide-loader-circle"
          color="neutral"
          variant="soft"
          :ui="{
            base: 'px-4',
            leadingIcon: 'animate-spin',
          }"
        />
        <UBadge
          v-if="isAvailable"
          icon="i-lucide-check"
          color="neutral"
          variant="soft"
          label="Verfügbar"
          :ui="{
            base: 'px-4',
            leadingIcon: 'text-green-600',
          }"
        />
        <UBadge
          v-if="!isAvailable && !isCheckingDomain && newDomain && !isTyping"
          icon="i-lucide-x"
          color="neutral"
          variant="soft"
          :label="isDomainValid ? 'Nicht verfügbar' : 'Ungültige Domain'"
          :ui="{
            base: 'px-4',
            leadingIcon: 'text-red-600',
          }"
        />
      </UButtonGroup>
    </UFormField>
    <USwitch
      v-if="isDomainValid && !isCheckingDomain && isAvailable && newDomain && !isTyping"
      v-model="customerHasConfirmedDomain"
      label="Ja, ich möchte diese Domain registrieren und mit meiner Solohost-Website verbinden."
      :disabled="isRegisteringDomain"
    />
    <Transition name="fade">
      <UAlert
        v-if="!$profile.subscription.paid"
        title="Zahlung ausstehend"
        icon="i-heroicons-exclamation-triangle"
        description="Ihre erste Abonnement-Zahlung ist noch nicht bestätigt. Während andere Funktionen Ihnen bereits zur Verfügung stehen, können Domainregistrierungen erst nach erfolgreichem Zahlungseingang durchgeführt werden. Haben Sie per SEPA-Lastschriftverfahren bezahlt, kann dies mehrere Tage dauern."
        :actions="[
          {
            label: 'Status prüfen',
            color: 'neutral',
            variant: 'soft',
            size: 'lg',
            block: true,
            loading: isUpdatingProfile,
            onClick: updateProfile,
          }
        ]"
      />
    </Transition>
    <UButton
      v-if="$profile.subscription.paid && !isRegisteringDomain && !registeredSuccessfully"
      label="Domain registrieren"
      :disabled="!isDomainValid || isCheckingDomain || isRegisteringDomain || !isAvailable || !customerHasConfirmedDomain || !$profile.subscription.paid"
      :loading="isRegisteringDomain"
      @click="registerDomain"
    />
    <Transition
      name="fade"
      mode="out-in"
    >
      <UAlert
        v-if="isRegisteringDomain"
        title="Domain wird registriert!"
        icon="i-lucide-loader-2"
        description="Das kann einen Moment dauern. Bitte schließen Sie dieses Fenster nicht."
        color="primary"
        close
        :ui="{
          close: 'text-white/50 hover:text-white active:text-white',
          icon: 'animate-spin',
        }"
      />
      <UAlert
        v-else-if="!isRegisteringDomain && registeredSuccessfully"
        title="Domain erfolgreich registriert!"
        icon="i-heroicons-check"
        :description="`Sie können Ihre Website jetzt über ${newDomain}.de erreichen. Ihre bisherige Subdomain ${$profile.username}.solohost.de leitet nun dorthin weiter.`"
        color="primary"
        close
        :ui="{
          close: 'text-white/50 hover:text-white active:text-white',
        }"
        @update:open="registeredSuccessfully = false"
      />
    </Transition>
  </div>
</template>
