<template>
  <ProfileMainHeaderVideo
    v-if="$profile.settings.public.header.video"
    class="h-screen"
  >
    <ProfileMainHeaderContent />
  </ProfileMainHeaderVideo>
  <ProfileMainHeaderImage
    v-else
    class="h-screen"
  >
    <ProfileMainHeaderContent />
  </ProfileMainHeaderImage>
</template>
