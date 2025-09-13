<script setup lang="ts">
const { showEmailSettings, go } = useAdmin()

const { data: domainInfo, refresh: refreshDomainInfo, pending: domainInfoPending } = useFetch('/api/user/domain/info')
</script>

<template>
  <USlideover
    :open="showEmailSettings"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: '!p-0',
    }"
    :close="{
      size: 'md',
      onClick: () => {
        go('#settings')
      },
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-envelope"
          class="inline-block size-6 opacity-50"
        />
        E-Mail
      </h3>
    </template>

    <template #body>
      <UAlert
        v-if="!$profile.domain"
        title="Domain erforderlich"
        description="Bitte verbinden Sie eine Domain, um E-Mail-Adressen zu erstellen."
        icon="i-heroicons-globe-alt"
        variant="soft"
        class="rounded-none"
        :actions="[
          {
            label: 'Domain einrichten',
            icon: 'i-heroicons-globe-alt',
            to: '#settings/domain',
            size: 'xl',
          },
        ]"
      />
      <div
        v-if="$profile.domain && !domainInfo?.hasMXRecords"
        class="p-4"
      >
        <p
          class="text-gray-500 mb-4"
        >
          Ihre Domain ist noch nicht für E-Mail-Postfächer konfiguriert. Bitte richten Sie bei Ihrem Domain-Anbieter die erforderlichen DNS-Einträge ein.
        </p>
        <table class="w-full text-left border-collapse mb-4">
          <thead>
            <tr>
              <th>
                Typ
              </th>
              <th>
                Name
              </th>
              <th>
                Wert
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                MX
              </td>
              <td>
                @ (oder leer lassen)
              </td>
              <td>
                mx.mailbox.org
              </td>
            </tr>
          </tbody>
        </table>
        <UButton
          label="DNS-Einstellungen überprüfen"
          icon="i-heroicons-arrows-right-left"
          class="w-full"
          :loading="domainInfoPending"
          @click="() => refreshDomainInfo()"
        />
        <UAlert
          title="Benötigen Sie Hilfe?"
          description="Je nach Anbieter kann dieser Schritt etwas abschreckend wirken. Nennen Sie uns Ihren Domain-Anbieter und wir helfen Ihnen gerne weiter."
          variant="soft"
          class="mt-4"
          :actions="[{
            label: 'Support kontaktieren',
            icon: 'i-lucide-headset',
            onClick: () => go('#support'),
            size: 'xl',
          }]"
        />
      </div>
      <ProfileAdminSettingsEmailMailboxes v-if="$profile.domain && domainInfo?.hasMXRecords" />
    </template>
  </USlideover>
</template>
