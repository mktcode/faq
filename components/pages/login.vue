<script setup lang="ts">
const appConfig = useAppConfig()

appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <div class="font-poppins min-h-screen max-w-lg mx-auto flex flex-col gap-12 items-center justify-between py-12">
    <SolohostLogo />
    <div class="bg-white p-4 max-w-sm w-full">
      <div class="flex flex-col gap-6">
        <LoginForm />

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-gray-500">oder</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <UButton
            to="/register"
            label="Neuen Zugang erstellen"
            icon="i-heroicons-key"
            size="xl"
            block
          />
          <UButton
            to="/"
            label="Zurück zur Startseite"
            icon="i-heroicons-arrow-left"
            variant="soft"
          />
        </div>
      </div>
    </div>
    <div />
  </div>
</template>
