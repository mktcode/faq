<script setup lang="ts">
const { me } = await useMe()
const emit = defineEmits(['goToSubscription'])
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <template v-if="me?.isSubscribed">
      <p class="text-gray-600">
        Domaineinstellungen...
      </p>
    </template>
    <template v-else>
      <p class="text-gray-400">
        Ihre Website ist aktuell unter <strong>{{ me?.userName }}.solihost.de</strong> erreichbar.
        Um eine eigene Domain zu registrieren und ein E-Mail-Postfach zu erstellen, benötigen Sie ein <strong>Abonnement</strong> für <strong>15 € im Monat</strong>.
      </p>
      <p class="text-gray-400">
        Außerdem erhalten Sie mit dem Abonnement:
      </p>
      <ul class="list-disc list-inside text-gray-400">
        <li>Mehr Speicherplatz für Bilder und Downloads</li>
        <li>KI-Assisstent für Anfragen und FAQ</li>
        <li>Individuelle Gestaltung (ab einmalig 400 €)</li>
      </ul>

      <UButton
        label="Jetzt upgraden"
        trailing-icon="i-heroicons-arrow-down"
        color="primary"
        :ui="{
          trailingIcon: 'ml-auto',
        }"
        @click="emit('goToSubscription')"
      />
    </template>
  </div>
</template>
