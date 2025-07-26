<script setup lang="ts">
import type { SettingsForm } from '~/types/db'

const { username, currentSettings } = defineProps<{
  username: string
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
        :class="getColorClass(currentSettings?.headerTitleColor || 'black', 'text')"
        :style="{ 'font-size': (currentSettings?.headerTitleFontSize || '10') + 'cqw' }"
      >
        {{ currentSettings?.title }}
      </h1>
      <p
        v-if="currentSettings?.description"
        class="text-center mb-4"
        :class="getColorClass(currentSettings?.headerDescriptionColor || 'black', 'text')"
        :style="{ 'font-size': (currentSettings?.headerDescriptionFontSize || '6') + 'cqw' }"
      >
        {{ currentSettings?.description }}
      </p>
      <ProfileDefaultLinks
        :settings="currentSettings"
        :username="username"
      />
    </div>
  </div>
</template>
