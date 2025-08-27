<script setup lang="ts">
const showModal = useState('showEmailModal', () => false)
</script>

<template>
  <USlideover
    v-model:open="showModal"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: '!p-0',
    }"
    :close="{
      size: 'md',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-envelope"
          class="inline-block size-6 opacity-50"
        />
        E-Mail
      </h3>
    </template>

    <template #body>
      <UAlert
        v-if="!$profile.domain"
        title="Domain erforderlich"
        description="Bitte verbinden Sie eine Domain, um E-Mail-Adressen zu erstellen."
        icon="i-heroicons-globe-alt"
        variant="soft"
        class="rounded-none"
      />
      <ProfileAdminEmailMailboxes
        v-else
        :domain="$profile.domain"
      />
    </template>
  </USlideover>
</template>
