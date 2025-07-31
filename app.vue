<script setup lang="ts">
import { de } from '@nuxt/ui/locale'

const { username, isOwned, isPublic, design, path } = await useProfile()
</script>

<template>
  <UApp :locale="de">
    <template v-if="username">
      <template v-if="isOwned || isPublic">
        <ProfileImpressum
          v-if="path === '/impressum'"
          :username="username"
        />
        <ProfileDatenschutz
          v-else-if="path === '/datenschutz'"
          :username="username"
        />
        <template v-else-if="path === '/'">
          <ProfileDefaultMain
            v-if="design === 'default'"
            :username="username"
          />
        </template>
        <Profile404 v-else />
      </template>
      <template v-else>
        <Profile404 />
      </template>
    </template>
    <PagesLogin v-else-if="path === '/login'" />
    <PagesRegister v-else-if="path === '/register'" />
    <PagesImpressum v-else-if="path === '/impressum'" />
    <PagesDatenschutz v-else-if="path === '/datenschutz'" />
    <PagesLandingpage v-else-if="path === '/'" />
    <template v-else-if="path === '/up'">
      Up!
    </template>
    <Pages404 v-else />
  </UApp>
</template>
