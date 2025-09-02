<script setup lang="ts">
const appConfig = useAppConfig()

appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <div class="font-poppins min-h-screen max-w-lg mx-auto flex flex-col gap-12 items-center justify-between py-12">
    <SolohostLogo />
    <div class="bg-white p-4 max-w-sm w-full">
      <div class="flex flex-col gap-2">
        <LoginForm />

        <UButton
          to="/"
          label="Zurück zur Startseite"
          icon="i-heroicons-arrow-left"
          variant="soft"
        />
      </div>
    </div>
    <div />
  </div>
</template>
