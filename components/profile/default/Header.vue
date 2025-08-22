<template>
  <ProfileDefaultHeaderVideo v-if="$profile.settings.header.video" />
  <ProfileDefaultHeaderImage v-else />
</template>
