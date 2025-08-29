<template>
  <ProfileMainHeaderBase
    class="bg-cover bg-center"
    :style="{ backgroundImage: $profile.settings.public.header.image ? `url(${$profile.settings.public.header.image})` : 'none' }"
  >
    <ProfileMainHeaderOverlay />
    <slot />
  </ProfileMainHeaderBase>
</template>
