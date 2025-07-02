<script setup lang="ts">
// const { data: me } = await useFetch('/api/me')
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <p class="text-gray-600">
      Mit einem Plus-Abonnement erhalten Sie Zugriff auf erweiterte Funktionen und und machen Ihr Gewerbeprofil mit unserer Hilfe zur professionellen Website.
    </p>
    <ul class="list-disc list-inside text-gray-600 mb-6">
      <li>Domain und E-Mail-Adresse inkl.</li>
      <li>Mehr Speicherplatz für Bilder und Downloads</li>
      <li>KI-Assisstent für Anfragen und FAQ</li>
      <li>Premium-Design ab 500 € einmalig</li>
    </ul>
    <div class="flex items-end gap-4 text-2xl">
      <div class="flex flex-col font-bold w-full">
        15 € mtl.
        <span class="text-gray-500 text-sm font-normal">inkl. MwSt.</span>
      </div>
      <div class="flex flex-col gap-2">
        <UButton
          label="Ich brauche nur Domain und E-Mail"
          variant="soft"
        />
        <UButton
          label="Plus abonnieren"
          trailing-icon="i-heroicons-rocket-launch"
          class="w-full"
          :ui="{
            trailingIcon: 'ml-auto',
          }"
        />
      </div>
    </div>
  </div>
</template>
