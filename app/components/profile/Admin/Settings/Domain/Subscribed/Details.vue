<script setup lang="ts">
const { data: info } = await useFetch('/api/user/domain/info')
const { go } = useAdmin()
</script>

<template>
  <UAlert
    v-if="info.domainIsActive"
    title="Domain verbunden"
    icon="i-lucide-check"
  >
    <template #description>
      Ihre Domain <strong>{{ $profile.domain }}</strong> ist verbunden.
    </template>
  </UAlert>
  <UAlert
    v-else
    title="Domain wird registriert"
    icon="i-lucide-loader-2"
    :ui="{
      icon: 'animate-spin',
    }"
  >
    <template #description>
      Ihre Domain <strong>{{ $profile.domain }}</strong> befindet sich im Registrierungsprozess. Dies kann bis zu 24 Stunden dauern.
    </template>
  </UAlert>
  <UAlert
    title="Fragen zur Domainverwaltung?"
    variant="soft"
    :actions="[
      {
        label: 'Support kontaktieren',
        icon: 'i-lucide-headset',
        size: 'xl',
        class: 'w-full',
        onClick: () => {
          go('#support')
        },
      }
    ]"
  />
</template>
