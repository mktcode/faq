<script setup lang="ts">
import type { SettingsForm } from '~/types/db';

const profile = defineProps<{
  username: string
  isPublic: boolean
  isSubscribed: boolean
  settings: SettingsForm
}>()

const nuxtApp = useNuxtApp()
nuxtApp.provide('admin', {
  username: profile.username,
  isPublic: profile.isPublic,
  isSubscribed: profile.isSubscribed,
  settings: profile.settings,
})

const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess
</script>

<template>
  <ProfileDefaultAdminNav />
  <AdminDesignModal />
  <AdminContentModal />
  <AdminFeedbackModal />
  <AdminEmailVerifiedModal v-if="emailVerified" />
  <AdminSubscriptionSuccessModal v-if="subscriptionSuccess" />
  <ClientOnly>
    <AdminWelcomeModal />
  </ClientOnly>
</template>