<script setup lang="ts">

</script>

<template>
  <template v-if="me?.domain && !me?.domainIsExternal">
    <UAlert
      title="Domain verbunden"
      variant="soft"
      icon="i-lucide-check"
    >
      <template #description>
        Ihre Domain <strong>{{ me?.domain }}</strong> ist verbunden.
      </template>
    </UAlert>
    <UButton
      label="Domain zu anderem Anbieter umziehen"
    />
    <UAlert
      title="Fragen zur Domainverwaltung?"
      variant="soft"
      icon="i-lucide-headset"
    >
      <template #description>
        Sie können uns jederzeit unter <strong>support@solihost.de</strong> oder über den Live-Chat unten rechts auf Ihrer Website erreichen.
      </template>
    </UAlert>
  </template>
  <div
    v-if="me?.domain && me?.domainIsExternal"
    class="flex items-center gap-4 bg-primary-600/10 border border-primary-500/20 rounded-lg px-4 py-3"
  >
    <UIcon
      name="i-heroicons-check"
      class="text-primary-500 size-6 shrink-0"
    />
    <div>
      Ihre extern registrierte Domain <strong>{{ me?.domain }}</strong> ist verbunden.
    </div>
  </div>
  <SettingsModalDomainNewSetup v-if="!me?.domain || me?.domainIsExternal" />
  <SettingsModalDomainExistingSetup v-if="!me?.domain || me?.domainIsExternal" />
</template>