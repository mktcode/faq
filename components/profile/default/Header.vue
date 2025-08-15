<script setup lang="ts">
const { settings } = await useProfile()
</script>

<template>
  <ProfileDefaultHeaderVideo v-if="settings.header.video" />
  <ProfileDefaultHeaderImage v-else />
</template>
