<script setup lang="ts">
const { $profile } = useProfile()
const { showMainSettings, go } = useAdmin()

const { clear } = useUserSession()

const { fetch: fetchUserSession } = useUserSession()

async function signOut() {
  go('')
  $profile.isOwned = false
  $profile.subscription.plan = null
  $profile.subscription.checkoutPending = false
  $profile.subscription.paid = false
  $profile.mailboxes = []
  await clear()
  fetchUserSession()
}
</script>

<template>
  <USlideover
    :open="showMainSettings"
    side="left"
    :close="{
      size: 'md',
      onClick: () => {
        go('')
      },
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
        @click="$profile.subscription.plan ? $router.push({ hash: '#settings/email' }) : $router.push({ hash: '#settings/subscription' })"
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

    <template #footer>
      <UButton
        label="Gerät verknüpfen"
        icon="i-heroicons-finger-print"
        variant="ghost"
        :ui="{
          base: 'ml-auto',
        }"
      />
      <UButton
        label="Abmelden"
        icon="i-heroicons-power"
        variant="ghost"
        @click="signOut"
      />
    </template>
  </USlideover>
</template>
