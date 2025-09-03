<template>
  <div
    class="absolute inset-0 z-10"
    :style="{
      backgroundColor: toHslString($profile.settings.public.header.imageOverlay.color),
      opacity: ($profile.settings.public.header.imageOverlay.opacity || 0) / 100,
    }"
  />
</template>
