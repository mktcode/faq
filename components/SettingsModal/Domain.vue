<script setup lang="ts">
const { me } = await useMe()
const emit = defineEmits(['goToSubscription'])
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <template v-if="me?.isSubscribed">
      <SettingsModalDomainNewSetup />
      <SettingsModalDomainExistingSetup />
    </template>
    <template v-else>
      <p
        v-if="me?.domain"
        class="text-gray-500"
      >
        Ihre Website ist unter <strong>{{ me?.domain }}</strong> erreichbar. Benötigen Sie noch eine passende E-Mail-Adresse,
        z.B. <strong>info@{{ me?.domain }}</strong>?
      </p>
      <p
        v-else
        class="text-gray-500"
      >
        Ihre Website ist aktuell unter <strong>{{ me?.userName }}.solihost.de</strong> erreichbar.
        Eine eigene Domain und ein E-Mail-Postfach sind in unserem <strong>Abonnement</strong> inklusive.
        Wenn Sie bereits eine Domain besitzen, können Sie diese für Ihre Website bei uns nutzen.
      </p>

      <UButton
        :label="me?.domain ? `Abonnieren und E-Mail-Postfach anlegen` : `Abonnieren und neue Domain registrieren`"
        trailing-icon="i-heroicons-rocket-launch"
        color="primary"
        :ui="{
          trailingIcon: 'ml-auto',
        }"
        @click="emit('goToSubscription')"
      />
      <SettingsModalDomainExistingSetup />
    </template>
  </div>
</template>
