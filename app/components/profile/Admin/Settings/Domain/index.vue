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
      },
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
      <div v-if="$profile.domain" class="p-4 border-b border-gray-200 flex items-center gap-4">
        <UIcon
          name="i-heroicons-check"
          class="inline-block size-6 opacity-50 text-green-600"
        />
        <p class="text-gray-500">
          Domain verbunden:<br>
          <strong>{{ $profile.domain }}</strong>
        </p>
      </div>
      <UButton
        label="Vorhandene Domain verbinden"
        icon="i-lucide-unplug"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="$router.push({ hash: '#settings/domain/connect' })"
      />

      <UButton
        label="Neue Domain registrieren"
        icon="i-lucide-globe-lock"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        @click="$profile.subscription.plan ? $router.push({ hash: '#settings/domain/register' }) : $router.push({ hash: '#settings/subscription' })"
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
    </template>
  </USlideover>
</template>
