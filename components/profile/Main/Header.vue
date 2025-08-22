<template>
  <ProfileMainHeaderVideo v-if="$profile.settings.header.video" />
  <ProfileMainHeaderImage v-else />
</template>
