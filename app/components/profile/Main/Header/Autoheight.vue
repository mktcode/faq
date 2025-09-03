<template>
  <ProfileMainHeaderVideo v-if="$profile.settings.public.header.video">
    <ProfileMainHeaderContent />
  </ProfileMainHeaderVideo>
  <ProfileMainHeaderImage v-else>
    <ProfileMainHeaderContent />
  </ProfileMainHeaderImage>
</template>
