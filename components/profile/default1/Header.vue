<script setup lang="ts">
import type { SettingsForm } from '~/types/db'

const { currentSettings } = defineProps<{
  currentSettings?: SettingsForm | null
}>()
</script>

<template>
  <div
    :style="{ backgroundImage: currentSettings?.headerImage ? `url(${currentSettings.headerImage})` : 'none' }"
    class="w-full bg-cover bg-center relative z-0"
  >
    <div
      class="absolute inset-0 z-0"
      :class="getColorClass(currentSettings?.headerImageOverlay?.color, 'bg')"
      :style="{ opacity: (currentSettings?.headerImageOverlay?.opacity || 0) / 100 }"
    />
    <div class="@container flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-24 px-6 relative z-10">
      <div
        v-if="currentSettings?.logo"
      >
        <NuxtImg
          :src="currentSettings.logo"
          alt="Logo"
          class="w-32 mb-4"
        />
      </div>
      <h1
        class="text-center font-bold mb-4 leading-none"
        :class="getColorClass(currentSettings?.headerTitleColor || 'white', 'text')"
        :style="{ 'font-size': currentSettings?.headerTitleFontSize + 'cqw' }"
      >
        {{ currentSettings?.title }}
      </h1>
      <p
        v-if="currentSettings?.description"
        class="text-center mb-4"
        :class="getColorClass(currentSettings?.headerDescriptionColor || 'white', 'text')"
        :style="{ 'font-size': currentSettings?.headerDescriptionFontSize + 'cqw' }"
      >
        {{ currentSettings?.description }}
      </p>
      <ProfileDefaultLinks
        v-if="currentSettings?.links?.length"
        :links="currentSettings.links"
      />
    </div>
  </div>
</template>
