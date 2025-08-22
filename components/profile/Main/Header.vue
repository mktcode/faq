<template>
  <ProfileMainHeaderVideo v-if="$profile.settings.public.header.video" />
  <ProfileMainHeaderImage v-else />
</template>
