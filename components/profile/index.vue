<script setup lang="ts">
import type { SettingsForm } from '~/types/db';

const path = useRoute().path

const { profile } = defineProps<{
  profile: {
    username: string
    isOwned: boolean
    isPublic: boolean
    isSubscribed: boolean
    settings: SettingsForm
    canonicalUrl: string
  }
}>()

const nuxtApp = useNuxtApp()
nuxtApp.provide('profile', {
  username: profile.username,
  isOwned: profile.isOwned,
  isPublic: profile.isPublic,
  isSubscribed: profile.isSubscribed,
  settings: profile.settings,
  canonicalUrl: profile.canonicalUrl,
})
</script>

<template>
  <ProfileAdmin v-if="profile.isOwned" />
  <ProfileMain v-if="path === '/'" />
  <ProfileImpressum v-else-if="path === '/impressum'" />
  <ProfileDatenschutz v-else-if="path === '/datenschutz'" />
  <Profile404 v-else />
</template>