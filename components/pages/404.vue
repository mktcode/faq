<script setup lang="ts">
const { appHost } = useRuntimeConfig().public
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen text-2xl">
    <p>
      Diese Seite konnte nicht gefunden werden.
    </p>
    <div class="mt-4 flex items-center">
      <UButton
        label="Zur Startseite"
        :to="`https://${appHost}`"
      />
    </div>
  </div>
</template>
