<script setup lang="ts">
const appConfig = useAppConfig()
appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen text-2xl">
    <SolohostLogo class="max-w-3xs mb-12" />
    <p>
      Vielen Dank für das Abschließen eines Abonnements. Sie können diese Seite nun schließen und zu Ihrer Website zurückkehren.
    </p>
  </div>
</template>
