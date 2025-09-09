<template>
  <FontWrapper
    :font="$profile.settings.public.design.font"
    class="relative"
  >
    <div class="flex flex-col items-center justify-center h-screen text-2xl">
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
