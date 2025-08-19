<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const { appIp } = useRuntimeConfig().public
const { me, refreshMe } = await useMe()
const emit = defineEmits(['goToSubscription'])

const existingDomainSetupOpen = ref(false)
const existingDomain = ref('')
const isACorrect = ref(false)
const hasBeenChecked = ref(false)
const domainConnectedSuccessfully = ref(false)

async function checkDns() {
  existingDomain.value = existingDomain.value.replace(/^https?:\/\//, '').replace(/^www\./, '')
  const result = await $fetch('/api/domain/checkDns', {
    method: 'POST',
    body: { domain: existingDomain.value },
  })

  hasBeenChecked.value = true
  isACorrect.value = result.isACorrect
}

async function updateDomain() {
  const { success } = await $fetch('/api/user/updateExternalDomain', {
    method: 'POST',
    body: { domain: existingDomain.value },
  })

  if (success) {
    await refreshMe()
    domainConnectedSuccessfully.value = true
    existingDomainSetupOpen.value = false
    existingDomain.value = ''
  }
}

watchDebounced(existingDomain, checkDns, { debounce: 750 })
</script>

<template>
  <UCollapsible
    v-model:open="existingDomainSetupOpen"
    class="flex flex-col gap-2"
    :ui="{
      root: 'border border-primary-500 rounded-lg',
      content: 'flex flex-col gap-2 px-3 pb-3',
    }"
  >
    <UButton
      :label="me?.domain ? 'Domain ändern' : 'Existierende Domain verbinden'"
      color="primary"
      variant="link"
      trailing-icon="i-heroicons-chevron-down"
      :ui="{
        trailingIcon: `ml-auto transition-transform ${existingDomainSetupOpen ? 'rotate-180' : ''}`,
      }"
    />

    <template #content>
      <Transition name="fade">
        <UAlert
          v-if="domainConnectedSuccessfully"
          title="Domain erfolgreich verbunden!"
          icon="i-heroicons-check"
          :description="`Sie können Ihre Website jetzt über ${me?.domain} erreichen. Ihre bisherige Subdomain ${me?.userName}.solihost.de leitet nun dorthin weiter.`"
          color="primary"
          close
          :ui="{
            close: 'text-primary-100 hover:text-primary-50 active:text-primary-200',
          }"
          @update:open="domainConnectedSuccessfully = false"
        />
      </Transition>

      <p class="text-gray-500">
        Dazu gehen Sie zu Ihrem Domain-Anbieter und suchen eine Option wie "DNS-Einstellungen" oder "Records bearbeiten".
      </p>

      <p class="text-gray-500">
        Dort legen Sie einen Eintrag vom <strong>Typ A</strong> mit dem Wert <strong>{{ appIp }}</strong> an.
        Wenn Sie das getan haben, geben Sie hier Ihre Domain ein.
      </p>

      <UInput
        v-model="existingDomain"
        placeholder="ihre-domain.de"
        class="w-full"
        size="xxl"
      />

      <UButton
        v-if="hasBeenChecked && isACorrect"
        label="Domain verbinden"
        @click="updateDomain"
      />
      <UAlert
        v-else-if="hasBeenChecked && !isACorrect"
        title="Ihre Domain ist nicht korrekt konfiguriert."
        color="warning"
        variant="outline"
      />

      <UAlert
        title="Benötigen Sie Hilfe?"
        variant="soft"
        icon="i-lucide-headset"
      >
        <template #description>
          Sie können uns jederzeit unter <strong>support@solihost.de</strong> oder über den Live-Chat unten rechts auf Ihrer Website erreichen.
        </template>
      </UAlert>
    </template>
  </UCollapsible>
</template>
