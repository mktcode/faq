<script setup lang="ts">
const { $profile } = useProfile()
const {
  showMainSettings,
  showCompanySettings,
  showDomainSettings,
  showEmailSettings,
  showSubscriptionSettings
} = useAdmin()
</script>

<template>
  <USlideover
    v-model:open="showMainSettings"
    side="left"
    :close="{
      size: 'md',
    }"
    :ui="{
      wrapper: 'z-40',
      body: '!p-0',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-cog-6-tooth"
          class="inline-block size-6 opacity-50"
        />
        Einstellungen
      </h3>
    </template>

    <template #body>
      <UButton
        label="Unternehmensdaten"
        icon="i-heroicons-building-office-2"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="showCompanySettings = true"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
      />

      <UButton
        label="Domain"
        icon="i-heroicons-globe-alt"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="showDomainSettings = true"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
      />

      <UButton
        label="E-Mail"
        icon="i-lucide-mail"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        :disabled="!$profile.isSubscribed"
        @click="showEmailSettings = true"
      >
        <template #trailing>
          <UBadge
            v-if="!$profile.isSubscribed"
            label="Premium"
            variant="outline"
            class="ml-auto"
          />
          <UIcon
            name="i-heroicons-chevron-right"
            class="size-6 ml-auto opacity-30"
          />
        </template>
      </UButton>

      <UButton
        label="Premium Abonnement"
        icon="i-heroicons-rocket-launch"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="showSubscriptionSettings = true"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
      />

      <ProfileAdminSettingsCompany />
      <ProfileAdminSettingsDomain />
      <ProfileAdminSettingsEmail />
      <ProfileAdminSettingsSubscription />
    </template>
  </USlideover>
</template>
