<script setup lang="ts">
import { de } from '@nuxt/ui/locale'

const path = useRoute().path
const profile = await useProfile()
</script>

<template>
  <UApp :locale="de">
    <template v-if="profile">
      <template v-if="profile.isOwned || profile.isPublic">
        <ProfileDefaultMain
          v-if="path === '/' && profile.design === 'default'"
          :username="profile.username"
          :isOwned="profile.isOwned"
          :isPublic="profile.isPublic"
          :isSubscribed="profile.isSubscribed"
          :settings="profile.settings"
          :canonical-url="profile.canonicalUrl"
        />
        <ProfileImpressum v-else-if="path === '/impressum'" />
        <ProfileDatenschutz v-else-if="path === '/datenschutz'" />
        <Profile404 v-else />
      </template>
      <Pages404 v-else />
    </template>
    <template v-else>
      <PagesLandingpage v-if="path === '/'" />
      <PagesLogin v-else-if="path === '/login'" />
      <PagesRegister v-else-if="path === '/register'" />
      <PagesImpressum v-else-if="path === '/impressum'" />
      <PagesDatenschutz v-else-if="path === '/datenschutz'" />
      <PagesUp v-else-if="path === '/up'" />
      <Pages404 v-else />
    </template>
  </UApp>
</template>
