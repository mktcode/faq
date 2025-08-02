<script setup lang="ts">
const { settings } = await useProfile()
</script>

<template>
  <div
    :style="{ backgroundImage: settings?.headerImage ? `url(${settings.headerImage})` : 'none' }"
    class="w-full bg-cover bg-center relative z-0"
  >
    <div
      class="absolute inset-0 z-0"
      :class="getColorClass(settings?.headerImageOverlay?.color, 'bg')"
      :style="{ opacity: (settings?.headerImageOverlay?.opacity || 0) / 100 }"
    />
    <div class="@container flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-24 px-6 relative z-10">
      <div
        v-if="settings?.logo"
      >
        <a href="/">
          <NuxtImg
            :src="settings.logo"
            alt="Logo"
            class="w-32 mb-4"
          />
        </a>
      </div>
      <a href="/">
        <h1
          class="text-center font-bold mb-4 leading-none"
          :class="getColorClass(settings?.headerTitleColor || 'black', 'text')"
          :style="{ 'font-size': (settings?.headerTitleFontSize || '10') + 'cqw' }"
        >
          {{ settings?.title }}
        </h1>
      </a>
      <p
        v-if="settings?.description"
        class="text-center mb-4"
        :class="getColorClass(settings?.headerDescriptionColor || 'black', 'text')"
        :style="{ 'font-size': (settings?.headerDescriptionFontSize || '6') + 'cqw' }"
      >
        {{ settings?.description }}
      </p>
      <ProfileDefaultLinks />
    </div>
  </div>
</template>
