<script setup lang="ts">
import type { SettingsForm } from '~/types/db';

const profile = defineProps<{
  username: string
  isOwned: boolean
  isPublic: boolean
  isSubscribed: boolean
  settings: SettingsForm['public']
  canonicalUrl: string
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

const extraScripts = []
if (profile.isOwned && profile.isSubscribed) {
  extraScripts.push({
    src: '/chatwoot.js',
    defer: true,
    async: true,
  })
}

useHead({
  title: profile.settings.meta.title || profile.settings.header.title || profile.settings.company.name || 'Solihost Website',
  meta: [
    { name: 'robots', content: profile.isPublic ? 'index, follow' : 'noindex, nofollow' },
    { name: 'theme-color', content: profile.settings.design.color },
    { property: 'og:url', content: profile.canonicalUrl },
    { property: 'og:image', content: profile.settings.meta.ogimage || profile.settings.header.image || '' },
    {
      name: 'description',
      content: profile.settings.meta.description || profile.settings.header.description || '',
    },
    {
      name: 'keywords',
      content: profile.settings.meta.keywords || '',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: profile.canonicalUrl,
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: profile.settings.meta.favicon || profile.settings.company.logo || '',
    },
    {
      rel: 'stylesheet',
      href: `/api/css?userName=${profile.username}`,
    },
  ],
  script: extraScripts,
})
</script>

<template>
  <FontWrapper
    id="main"
    :font="profile.settings.design.font"
    class="relative"
  >
    <!-- <ProfileDefaultAdmin v-if="profile.isOwned" /> -->
    <ProfileDefaultHeader />
    <div class="flex flex-col items-center justify-center gap-2 max-w-lg mx-auto py-12 px-6">
      <ProfileDefaultComponentViewer
        v-for="index in 5"
        :key="index"
        :slot-index="index"
      />

      <ProfileDefaultFooter />
    </div>
  </FontWrapper>
</template>
