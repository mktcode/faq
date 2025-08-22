<template>
  <FontWrapper
    :font="$profile.settings.design.font"
    class="relative"
  >
    <div class="flex flex-col items-center justify-center h-screen text-2xl">
      <img
        v-if="$profile.settings.company.logo"
        :src="$profile.settings.company.logo"
        alt="Logo"
        class="max-w-3xs mb-12"
      >
      <p>
        Dieses Seite existiert nicht.
      </p>
      <div class="mt-4 flex items-center">
        <UButton
          label="Startseite"
          to="/"
        />
      </div>
    </div>
  </FontWrapper>
</template>
