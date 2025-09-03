<script setup lang="ts">
const { appHost } = useRuntimeConfig().public
const appConfig = useAppConfig()
appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen text-2xl">
    <SolohostLogo class="max-w-3xs mb-12" />
    <p>
      Diese Seite konnte nicht gefunden werden.
    </p>
    <div class="mt-4 flex items-center gap-2">
      <UButton
        label="Anmelden"
        :to="`https://${appHost}/login`"
      />
      <UButton
        label="Zur Startseite"
        :to="`https://${appHost}`"
      />
    </div>
  </div>
</template>
