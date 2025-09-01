<template>
  <ProfileAdminSettingsDomainUnsubscribedDetails v-if="$profile.domain" />
  <ProfileAdminSettingsDomainUnsubscribedSetup v-else />
</template>
