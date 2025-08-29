<template>
  <div
    class="absolute inset-0 z-10"
    :style="{
      backgroundColor: $profile.settings.public.header.imageOverlay.color || 'transparent',
      opacity: ($profile.settings.public.header.imageOverlay.opacity || 0) / 100,
    }"
  />
</template>