<script setup lang="ts">
const { appHost } = useRuntimeConfig().public
const { username } = await useProfile()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen text-2xl">
    <SolihostLogo class="max-w-3xs mb-12" />
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
</template>
