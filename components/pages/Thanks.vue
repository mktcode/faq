<script setup lang="ts">
const appConfig = useAppConfig()
appConfig.ui.colors.primary = 'sky'

const animatedGreen = ref(false)
setTimeout(() => {
  animatedGreen.value = true
}, 300)
</script>

<template>
  <div class="flex flex-col items-center h-screen py-12">
    <SolohostLogo class="max-w-3xs mb-24" />
    <div class="flex flex-col items-center">
      <UIcon
        name="i-lucide-circle-check-big"
        class="size-20 transition-colors duration-1000"
        :class="{
          'text-gray-200': !animatedGreen,
          'text-green-600': animatedGreen
        }"
      />
      <p class="max-w-xl mx-auto p-6 text-center text-xl">
        Vielen Dank für das Abschließen eines Abonnements. Sie können diese Seite nun schließen und zu Ihrer Website zurückkehren.
      </p>
    </div>
  </div>
</template>
