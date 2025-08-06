<script setup lang="ts">
import { de } from '@nuxt/ui/locale'

const { settings, username, isOwned, isPublic, design, path } = await useProfile()
const offerPaths = computed(() => settings.value && settings.value.components.offers.items.length > 1 ? settings.value.components.offers.items.map((offer) => `/${offer.slug}`) : [])
</script>

<template>
  <UApp :locale="de">
    <template v-if="username">
      <template v-if="isOwned || isPublic">
        <ProfileDefaultMain v-if="['/', ...offerPaths].includes(path) && design === 'default'" />
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
