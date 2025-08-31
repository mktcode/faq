<script setup lang="ts">
import type { SettingsForm } from '~/types/db'

const path = useRoute().path

const { profile } = defineProps<{
  profile: {
    username: string
    isOwned: boolean
    isPublic: boolean
    subscription: {
      plan: 'S' | 'L' | null
      checkoutPending: boolean
      paid: boolean
    }
    settings: SettingsForm
    canonicalUrl: string
    domain: string | null
    domainIsExternal: boolean
    mailboxes: string[]
  }
}>()

const nuxtApp = useNuxtApp()
nuxtApp.provide('profile', profile)
</script>

<template>
  <ProfileAdmin v-if="$profile.isOwned" />
  <ProfileMain v-if="path === '/'" />
  <ProfileImpressum v-else-if="path === '/impressum'" />
  <ProfileDatenschutz v-else-if="path === '/datenschutz'" />
  <Profile404 v-else />
</template>
