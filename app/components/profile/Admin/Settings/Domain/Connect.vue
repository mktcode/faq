<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

const { showDomainConnect, go } = useAdmin()

const { lbIp } = useRuntimeConfig().public

const { isCheckingDns, hasBeenChecked, isACorrect, checkDns } = useDnsCheck()
const { updateDomain, isUpdatingDomain } = useExternalDomain()

const existingDomain = ref('')

watchDebounced(existingDomain, () => checkDns(existingDomain.value), { debounce: 750 })
</script>

<template>
  <USlideover
    :open="showDomainConnect"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: 'flex flex-col gap-4',
    }"
    :close="{
      size: 'md',
      onClick: () => {
        go('#settings/domain')
      },
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-globe-alt"
          class="inline-block size-6 opacity-50"
        />
        Domain verbinden
      </h3>
    </template>

    <template #body>
      <p class="text-gray-500">
        Um Ihre vorhandene Domain zu verbinden, gehen Sie zu Ihrem Domain-Anbieter und suchen eine Option wie "DNS-Einstellungen" oder "Records bearbeiten".
      </p>

      <p class="text-gray-500">
        Dort legen Sie einen Eintrag vom <strong>Typ A</strong> mit dem Wert <strong>{{ lbIp }}</strong> an.
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
      <ProfileAdminSettingsDomainDnsCheckFailed
        v-if="hasBeenChecked && !isACorrect"
        :is-checking-dns="isCheckingDns"
        @check-dns="() => checkDns(existingDomain)"
      />

      <UAlert
        title="Benötigen Sie Hilfe?"
        variant="soft"
        :actions="[{
          label: 'Support kontaktieren',
          icon: 'i-lucide-headset',
          onClick: () => go('#support'),
          size: 'xl',
        }]"
      />
    </template>
  </USlideover>
</template>
