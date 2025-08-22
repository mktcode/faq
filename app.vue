<script setup lang="ts">
import { de } from '@nuxt/ui/locale'

const path = useRoute().path
const profile = await useProfile()
</script>

<template>
  <UApp :locale="de">
    <Profile
      v-if="profile"
      :profile="profile"
    />
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
