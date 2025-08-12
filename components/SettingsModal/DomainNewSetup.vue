<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const newDomain = ref('')
const isCheckingDomain = ref(false)
const isAvailable = ref(false)

async function checkDomainAvailability() {
  if (!newDomain.value.endsWith('.de')) {
    isAvailable.value = false
    return
  }

  isCheckingDomain.value = true
  isAvailable.value = false

  // endpoint: /api/user/checkDomainAvailability
  const checkResult = await $fetch('/api/user/checkDomainAvailability', {
    method: 'POST',
    body: { domain: newDomain.value },
  })

  await new Promise(resolve => setTimeout(resolve, 1000))

  isAvailable.value = checkResult.isAvailable
  isCheckingDomain.value = false
}

watchDebounced(newDomain, checkDomainAvailability, { debounce: 500 })
</script>

<template>
  <div class="flex flex-col gap-4">
    <UFormField label="Domain registrieren">
      <UButtonGroup class="w-full">
        <UInput
          v-model="newDomain"
          placeholder="ihre-domain.de"
          class="w-full"
          size="xxl"
        />
        <UBadge
          v-if="isCheckingDomain"
          icon="i-lucide-loader-circle"
          color="neutral"
          variant="soft"
          :ui="{
            base: 'px-4',
            leadingIcon: 'animate-spin'
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
            leadingIcon: 'text-green-600'
          }"
        />
        <UBadge
          v-if="!isAvailable && !isCheckingDomain && newDomain.endsWith('.de')"
          icon="i-lucide-x"
          color="neutral"
          variant="soft"
          label="Nicht verfügbar"
          :ui="{
            base: 'px-4',
            leadingIcon: 'text-red-600'
          }"
        />
      </UButtonGroup>
    </UFormField>
    <UButton
      label="Domain registrieren"
      :disabled="!newDomain"
    />
  </div>
</template>
