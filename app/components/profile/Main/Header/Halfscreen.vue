<template>
  <ProfileMainHeaderVideo
    v-if="$profile.settings.public.header.video"
    class="h-[50vh]"
  >
    <ProfileMainHeaderContent />
  </ProfileMainHeaderVideo>
  <ProfileMainHeaderImage
    v-else
    class="h-[50vh]"
  >
    <ProfileMainHeaderContent />
  </ProfileMainHeaderImage>
</template>
