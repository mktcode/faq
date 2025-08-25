<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const { appIp } = useRuntimeConfig().public
const emit = defineEmits(['goToSubscription'])

const { isCheckingDns, hasBeenChecked, isACorrect, checkDns } = useDnsCheck()
const { updateDomain, isUpdatingDomain, domainConnectedSuccessfully } = useExternalDomain()

const existingDomain = ref('')
const existingDomainSetupOpen = ref(false)

watchDebounced(existingDomain, () => checkDns(existingDomain.value), { debounce: 750 })
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
      :label="$profile.settings.private.domain ? 'Domain ändern' : 'Existierende Domain verbinden'"
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
          :description="`Sie können Ihre Website jetzt über ${$profile.settings.private.domain} erreichen. Ihre bisherige Subdomain ${$profile.username}.solohost.de leitet nun dorthin weiter.`"
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
        :loading="isUpdatingDomain"
        @click="() => updateDomain(existingDomain)"
      />
      <ProfileAdminSettingsModalDomainDnsCheckFailed
        v-if="hasBeenChecked && !isACorrect"
        :is-checking-dns="isCheckingDns"
        @check-dns="() => checkDns(existingDomain)"
      />

      <UAlert
        title="Benötigen Sie Hilfe?"
        variant="soft"
        icon="i-lucide-headset"
      >
        <template #description>
          Sie können uns jederzeit unter <strong>support@solohost.de</strong> oder über den Live-Chat unten rechts auf Ihrer Website erreichen.
        </template>
      </UAlert>
    </template>
  </UCollapsible>
</template>
