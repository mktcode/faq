<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const newDomain = ref('')
watch(newDomain, () => isTyping.value = true)
watchDebounced(newDomain, () => isTyping.value = false, { debounce: 600 })
watchDebounced(newDomain, checkDomainAvailability, { debounce: 500 })

const toast = useToast()

const { $profile } = useProfile()

// TODO: improve domain validation
const isDomainValid = computed(() => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(newDomain.value)) // without tld!
const isCheckingDomain = ref(false)
const isAvailable = ref(false)
const isTyping = ref(false)
const customerHasConfirmedDomain = ref(false)
const isRegisteringDomain = ref(false)

async function checkDomainAvailability() {
  isCheckingDomain.value = true
  isAvailable.value = false

  try {
    const checkResult = await $fetch('/api/user/checkDomainAvailability', {
      method: 'POST',
      body: { domain: newDomain.value + '.de' },
    })

    await new Promise(resolve => setTimeout(resolve, 1000))

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
          :disabled="isCheckingDomain || isRegisteringDomain"
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
      label="Ja, ich möchte diese Domain registrieren und mit meiner Solihost-Website verbinden."
      :disabled="isRegisteringDomain"
    />
    <UButton
      label="Domain registrieren"
      :disabled="!isDomainValid || isCheckingDomain || isRegisteringDomain || !isAvailable || !customerHasConfirmedDomain"
      :loading="isRegisteringDomain"
      @click="registerDomain"
    />
  </div>
</template>
