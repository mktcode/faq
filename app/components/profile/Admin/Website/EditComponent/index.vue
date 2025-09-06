<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const { showWebsiteComponentSettings, websiteSettingsComponentIndex, websiteSettingsComponentKey, go } = useAdmin()

const isDesktop = useMediaQuery('(min-width: 640px)')
</script>

<template>
  <UDrawer
    :open="showWebsiteComponentSettings"
    :direction="isDesktop ? 'left' : 'bottom'"
    close-icon="i-heroicons-arrow-left"
    handle-only
    :overlay="false"
    :close-threshold="0.85"
    :ui="{
      content: 'shadow-2xl shadow-black',
      container: 'relative max-w-md no-scrollbar',
      handle: '!bg-gray-400',
      header: 'h-10',
      body: 'flex flex-col gap-2',
    }"
    @close="() => go('#website')"
  >
    <template #header>
      <ProfileMainDrawerTip />
      <h3 class="text-lg font-semibold flex gap-2">
        <UIcon
          name="i-heroicons-megaphone"
          class="inline-block size-6 opacity-50"
        />
        {{ $profile.settings.public.components[websiteSettingsComponentIndex]?.title }}
        <div class="flex items-center gap-2 ml-auto">
          <ProfileAdminSaveAndReset />
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            size="md"
            @click="go('#website')"
          />
        </div>
      </h3>
    </template>

    <template #body>
      <ProfileAdminWebsiteOffering
        :key="websiteSettingsComponentIndex"
        v-if="$profile.settings.public.components[websiteSettingsComponentIndex]?.key === 'offerings'"
        v-model:component="$profile.settings.public.components[websiteSettingsComponentIndex]"
      />
      <!-- <ProfileAdminWebsiteGallery v-else-if="component.key === 'gallery'" />
      <ProfileAdminWebsiteDownloads v-else-if="component.key === 'downloads'" />
      <ProfileAdminWebsiteForm v-else-if="component.key === 'form'" />
      <ProfileAdminWebsiteFaq v-else-if="component.key === 'faq'" /> -->
    </template>
  </UDrawer>
</template>
