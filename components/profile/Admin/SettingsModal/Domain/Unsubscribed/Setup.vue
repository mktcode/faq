<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const { appIp } = useRuntimeConfig().public
const emit = defineEmits(['goToSubscription'])

const { $profile } = useProfile()

const existingDomainSetupOpen = ref(false)
const existingDomain = ref('')
const isACorrect = ref(false)
const hasBeenChecked = ref(false)
const domainConnectedSuccessfully = ref(false)
const isUpdatingDomain = ref(false)

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
  if (isUpdatingDomain.value) return
  isUpdatingDomain.value = true

  // TODO: catch errors in all these situations
  const { success } = await $fetch('/api/user/updateExternalDomain', {
    method: 'POST',
    body: { domain: existingDomain.value },
  })

  if (success) {
    $profile.domain = existingDomain.value
    $profile.domainIsExternal = true
    domainConnectedSuccessfully.value = true
    existingDomain.value = ''
  }

  isUpdatingDomain.value = false
}

watchDebounced(existingDomain, checkDns, { debounce: 750 })
</script>

<template>
  <p class="text-gray-500">
    Ihre Website ist aktuell unter <strong>{{ $profile.username }}.solihost.de</strong> erreichbar.
    Wenn Sie bereits eine Domain besitzen, können Sie diese für Ihre Website bei uns nutzen.
    Eine neue Domain und bis zu 3 E-Mail-Postfächer sind im <strong>Premium-Paket</strong> inklusive.
  </p>
  <UCollapsible
    v-model:open="existingDomainSetupOpen"
    class="flex flex-col gap-2"
    :ui="{
      root: 'border border-primary-500 rounded-lg',
      content: 'flex flex-col gap-2 px-3 pb-3',
    }"
  >
    <UButton
      :label="$profile.settings.private.domain ? 'Domain ändern' : 'Existierende Domain verbinden'"
      color="primary"
      variant="link"
      trailing-icon="i-heroicons-chevron-down"
      :ui="{
        trailingIcon: `ml-auto transition-transform ${existingDomainSetupOpen ? 'rotate-180' : ''}`,
      }"
    />

    <template #content>
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

      <Transition name="fade">
        <UAlert
          v-if="domainConnectedSuccessfully"
          title="Domain erfolgreich verbunden!"
          icon="i-heroicons-check"
          :description="`Sie können Ihre Website jetzt über ${existingDomain} erreichen. Ihre bisherige Subdomain ${$profile.username}.solihost.de leitet nun dorthin weiter.`"
          color="primary"
          close
          :ui="{
            close: 'text-white/50 hover:text-white active:text-white',
          }"
          @update:open="domainConnectedSuccessfully = false"
        />
      </Transition>

      <UAlert
        title="Benötigen Sie Hilfe?"
        variant="soft"
        icon="i-lucide-headset"
      >
        <template #description>
          Sie können uns jederzeit unter <strong>support@solihost.de</strong> erreichen.
        </template>
      </UAlert>
    </template>
  </UCollapsible>
  <UButton
    label="Premium buchen und Domain registrieren"
    trailing-icon="i-heroicons-rocket-launch"
    color="primary"
    :ui="{
      trailingIcon: 'ml-auto',
    }"
    @click="emit('goToSubscription')"
  />
</template>
