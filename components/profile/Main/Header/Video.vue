<template>
  <ProfileMainHeaderBase>
    <video
      class="absolute inset-0 z-0 w-full h-full object-cover object-center pointer-events-none"
      :src="$profile.settings.public.header.video"
      :poster="$profile.settings.public.header.image || undefined"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      aria-hidden="true"
    />
    <ProfileMainHeaderOverlay />
    <slot />
  </ProfileMainHeaderBase>
</template>
