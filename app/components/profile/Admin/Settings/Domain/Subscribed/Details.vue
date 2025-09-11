<script setup lang="ts">
const { data: domainIsActive } = await useFetch('/api/user/domain/info')
</script>

<template>
  <UAlert
    v-if="domainIsActive"
    title="Domain verbunden"
    icon="i-lucide-check"
  >
    <template #description>
      Ihre Domain <strong>{{ $profile.domain }}</strong> ist verbunden.
    </template>
  </UAlert>
  <UAlert
    v-else
    title="Domain wird verbunden"
    icon="i-lucide-loader-2"
    :ui="{
      icon: 'animate-spin',
    }"
  >
    <template #description>
      Ihre Domain <strong>{{ $profile.domain }}</strong> wird gerade verbunden. Haben Sie bitte noch einen Moment Geduld.
    </template>
  </UAlert>
  <UAlert
    title="Fragen zur Domainverwaltung?"
    variant="soft"
    icon="i-lucide-headset"
  >
    <template #description>
      Sie können uns jederzeit unter <strong>support@solohost.de</strong> oder über den Live-Chat unten rechts auf Ihrer Website erreichen.
    </template>
  </UAlert>
</template>
