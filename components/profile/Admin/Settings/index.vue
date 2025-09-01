<script setup lang="ts">
const { $profile } = useProfile()
const {
  showMainSettings,
  showCompanySettings,
  showDomainSettings,
  showEmailSettings,
  showSubscriptionSettings,
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
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
  @click="$router.push({ hash: '#settings/company' })"
      />

      <UButton
        label="Domain"
        icon="i-heroicons-globe-alt"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
  @click="$router.push({ hash: '#settings/domain' })"
      />

      <UButton
        label="E-Mail"
        icon="i-lucide-mail"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        :disabled="!$profile.subscription.plan"
  @click="$router.push({ hash: '#settings/email' })"
      >
        <template #trailing>
          <div class="ml-auto flex items-center gap-2">
            <UBadge
              v-if="!$profile.subscription.plan"
              label="Premium"
              variant="outline"
            />
            <UIcon
              name="i-heroicons-chevron-right"
              class="size-6 opacity-30"
            />
          </div>
        </template>
      </UButton>

      <UButton
        label="Premium Abonnement"
        icon="i-heroicons-rocket-launch"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
  @click="$router.push({ hash: '#settings/subscription' })"
      />

      <ProfileAdminSettingsCompany />
      <ProfileAdminSettingsDomain />
      <ProfileAdminSettingsEmail />
      <ProfileAdminSettingsSubscription />
    </template>
  </USlideover>
</template>
