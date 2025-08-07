<script setup lang="ts">
const { appHost } = useRuntimeConfig().public
const { username, settings } = await useProfile()

const appConfig = useAppConfig()
const font = computed(() => settings.value.design.font)
appConfig.ui.colors.primary = settings.value.design.color
appConfig.ui.button.defaultVariants.rounded = settings.value.design.rounded
</script>

<template>
  <FontWrapper
    :font="font"
    class="relative"
  >
    <div class="flex flex-col items-center justify-center h-screen text-2xl">
      <img
        v-if="settings.company.logo"
        :src="settings.company.logo"
        alt="Logo"
        class="max-w-3xs mb-12"
      />
      <p>
        Dieses Seite existiert nicht.
      </p>
      <div class="mt-4 flex items-center">
        <UButton
          label="Startseite"
          :to="`https://${username}.${appHost}`"
        />
      </div>
    </div>
  </FontWrapper>
</template>
