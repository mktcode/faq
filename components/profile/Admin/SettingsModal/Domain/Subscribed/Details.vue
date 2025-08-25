<template>
  <UAlert
    title="Domain verbunden"
    icon="i-lucide-check"
  >
    <template #description>
      Ihre Domain <strong>{{ $profile.domain }}</strong> ist verbunden.
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