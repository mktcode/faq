<template>
  <ProfileMainHeaderFullscreen v-if="$profile.settings.public.header.height === 'full'" />
  <ProfileMainHeaderHalfscreen v-else-if="$profile.settings.public.header.height === 'half'" />
  <ProfileMainHeaderAutoheight v-else-if="$profile.settings.public.header.height === 'auto'" />
  <ProfileMainHeaderBoxed v-else-if="$profile.settings.public.header.height === 'boxed'" />
</template>
