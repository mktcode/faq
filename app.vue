<script setup lang="ts">
import { de } from '@nuxt/ui/locale'

const { username, isOwned, isPublic, design, path } = await useProfile()
</script>

<template>
  <UApp :locale="de">
    <template v-if="username">
      <template v-if="isOwned || isPublic">
        <ProfileDefaultMain v-if="path === '/' && design === 'default'" />
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
