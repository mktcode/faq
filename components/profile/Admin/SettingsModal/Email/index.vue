<template>
  <UAlert v-if="!$profile.domain"
    title="Domain erforderlich"
    description="Bitte verbinden Sie eine Domain, um E-Mail-Adressen zu erstellen."
    icon="i-heroicons-globe-alt"
    variant="soft"
    class="rounded-none"
  />
  <ProfileAdminSettingsModalEmailMailboxes
    v-else
    :domain="$profile.domain"
  />
</template>
