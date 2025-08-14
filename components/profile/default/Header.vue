<script setup lang="ts">
const { settings } = await useProfile()
</script>

<template>
  <div
    id="header"
    :style="{ backgroundImage: settings.header.image ? `url(${settings.header.image})` : 'none' }"
    class="w-full flex flex-col items-center justify-center bg-cover bg-center relative z-0"
    :class="{
      'min-h-[50vh]': settings.header.height === 'half',
      'h-screen': settings.header.height === 'full',
    }"
  >
    <div
      class="absolute inset-0 z-0"
      :style="{
        backgroundColor: settings.header.imageOverlay.color || 'transparent',
        opacity: (settings.header.imageOverlay.opacity || 0) / 100,
      }"
    />
    <div
      class="@container w-full flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-24 px-6 relative z-10"
    >
      <div
        v-if="settings.company.logo"
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
          class="text-center text-shadow-lg font-bold mb-4 leading-none opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.5s_forwards]"
          :style="{
            'color': settings.header.titleColor || 'black',
            'font-size': (settings.header.titleFontSize || '10') + 'cqw',
          }"
        >
          {{ settings.header.title }}
        </h1>
      </a>
      <p
        v-if="settings.header.description"
        class="text-center text-shadow-md mb-4 opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.8s_forwards]"
        :style="{
          'color': settings.header.descriptionColor || 'black',
          'font-size': (settings.header.descriptionFontSize || '6') + 'cqw',
        }"
      >
        {{ settings.header.description }}
      </p>
      <ProfileDefaultLinks />
    </div>
  </div>
</template>
