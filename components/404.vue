<script setup lang="ts">
const { appHost } = useRuntimeConfig().public
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen text-2xl">
    <p>
      Dieses Profil existiert nicht oder ist nicht öffentlich.
    </p>
    <div class="mt-4 flex items-center">
      <UButton
        label="Anmelden"
        :to="`https://${appHost}/login`"
      />
    </div>
  </div>
</template>