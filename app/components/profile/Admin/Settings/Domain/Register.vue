<script setup lang="ts">
const { showDomainRegister, go } = useAdmin()
</script>

<template>
  <USlideover
    :open="showDomainRegister"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: 'flex flex-col gap-4',
    }"
    :close="{
      size: 'md',
      onClick: () => {
        go('#settings/domain')
      },
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-globe-alt"
          class="inline-block size-6 opacity-50"
        />
        Domain registrieren
      </h3>
    </template>

    <template #body>
      <ProfileAdminSettingsDomainSubscribedNewSetup />
    </template>
  </USlideover>
</template>
