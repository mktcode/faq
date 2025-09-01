<script setup lang="ts">
const { showDomainSettings, go } = useAdmin()
</script>

<template>
  <USlideover
    :open="showDomainSettings"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: '!p-0',
    }"
    :close="{
      size: 'md',
      onClick: () => {
        go('#settings')
      }
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-globe-alt"
          class="inline-block size-6 opacity-50"
        />
        Domain
      </h3>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 p-4">
        <ProfileAdminSettingsDomainSubscribed v-if="$profile.subscription.plan" />
        <ProfileAdminSettingsDomainUnsubscribed v-else />
      </div>
    </template>
  </USlideover>
</template>
