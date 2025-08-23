<script setup lang="ts">
const emit = defineEmits(['goToSubscription'])
</script>

<template>
  <p
    v-if="$profile.settings.private.domain"
    class="text-gray-500"
  >
    Ihre Website ist unter <strong>{{ $profile.settings.private.domain }}</strong> erreichbar. Benötigen Sie noch eine passende E-Mail-Adresse,
    z.B. <strong>info@{{ $profile.settings.private.domain }}</strong>?
  </p>
  <p
    v-else
    class="text-gray-500"
  >
    Ihre Website ist aktuell unter <strong>{{ $profile.username }}.solihost.de</strong> erreichbar.
    Eine eigene Domain und ein E-Mail-Postfach sind in unserem <strong>Abonnement</strong> inklusive.
    Wenn Sie bereits eine Domain besitzen, können Sie diese für Ihre Website bei uns nutzen.
  </p>

  <UButton
    :label="$profile.settings.private.domain ? `Abonnieren und E-Mail-Postfach anlegen` : `Abonnieren und neue Domain registrieren`"
    trailing-icon="i-heroicons-rocket-launch"
    color="primary"
    :ui="{
      trailingIcon: 'ml-auto',
    }"
    @click="emit('goToSubscription')"
  />
  <ProfileAdminSettingsModalDomainExistingSetup />
</template>