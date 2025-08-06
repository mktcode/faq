<script setup lang="ts">
const { settings } = await useProfile()
</script>

<template>
  <div
    :style="{ backgroundImage: settings?.header?.image ? `url(${settings.header.image})` : 'none' }"
    class="w-full bg-cover bg-center relative z-0"
  >
    <div
      class="absolute inset-0 z-0"
      :class="getColorClass(settings?.header?.imageOverlay?.color, 'bg')"
      :style="{ opacity: (settings?.header?.imageOverlay?.opacity || 0) / 100 }"
    />
    <div class="@container flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-24 px-6 relative z-10">
      <div
        v-if="settings?.company.logo"
      >
        <a href="/">
          <NuxtImg
            :src="settings.company.logo"
            alt="Logo"
            class="w-32 mb-4"
          />
        </a>
      </div>
      <a href="/">
        <h1
          class="text-center font-bold mb-4 leading-none"
          :class="getColorClass(settings?.header.titleColor || 'black', 'text')"
          :style="{ 'font-size': (settings?.header.titleFontSize || '10') + 'cqw' }"
        >
          {{ settings?.header.title }}
        </h1>
      </a>
      <p
        v-if="settings?.header.description"
        class="text-center mb-4"
        :class="getColorClass(settings?.header.descriptionColor || 'black', 'text')"
        :style="{ 'font-size': (settings?.header.descriptionFontSize || '6') + 'cqw' }"
      >
        {{ settings?.header.description }}
      </p>
      <ProfileDefaultLinks />
    </div>
  </div>
</template>
