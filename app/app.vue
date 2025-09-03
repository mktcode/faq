<script setup lang="ts">
import { de } from '@nuxt/ui/locale'

const path = useRoute().path
const nuxtApp = useNuxtApp()
const profile = useState('profile', () => nuxtApp.ssrContext?.event.context.profile || null)
</script>

<template>
  <UApp :locale="de">
    <Profile
      v-if="profile"
      :profile="profile"
    />
    <template v-else>
      <PagesLandingpage v-if="path === '/'" />
      <PagesSupport v-else-if="path === '/support'" />
      <PagesLogin v-else-if="path === '/login'" />
      <PagesRegister v-else-if="path === '/register'" />
      <PagesImpressum v-else-if="path === '/impressum'" />
      <PagesDatenschutz v-else-if="path === '/datenschutz'" />
      <PagesAgb v-else-if="path === '/agb'" />
      <PagesUp v-else-if="path === '/up'" />
      <PagesThanks v-else-if="path === '/danke'" />
      <Pages404 v-else />
    </template>
  </UApp>
</template>
