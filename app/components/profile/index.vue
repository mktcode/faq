<script setup lang="ts">
import type { SettingsForm } from '~~/types/db'

const path = useRoute().path

const { profile } = defineProps<{
  profile: {
    id: number
    username: string
    isOwned: boolean
    isAdmin: boolean
    isPublic: boolean
    subscription: {
      plan: 'S' | 'L' | null
      paid: boolean
    }
    settings: SettingsForm
    originalSettings: SettingsForm
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
  <ClientOnly>
    <ProfileAdmin v-if="$profile.isOwned || $profile.isAdmin" />
  </ClientOnly>
  <ProfileMain v-if="$profile.settings.public.pages.map(page => page.path).includes(path)" />
  <ProfileImpressum v-else-if="path === '/impressum'" />
  <ProfileDatenschutz v-else-if="path === '/datenschutz'" />
  <Profile404 v-else />
</template>
