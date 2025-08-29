<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess
</script>

<template>
  <ProfileAdminNav />
  <ProfileAdminSettings />
  <ProfileAdminWebsite />
  <ProfileAdminWebsiteDesign />
  <ProfileAdminWebsiteOffering />
  <ProfileAdminWebsiteForm />
  <ProfileAdminWebsiteGallery />
  <ProfileAdminWebsiteFaq />
  <ProfileAdminWebsiteDownloads />
  <ProfileAdminAssistant />
  <ProfileAdminSupport />
  <ProfileAdminEmailVerified v-if="emailVerified" />
  <ProfileAdminSubscriptionSuccess v-if="subscriptionSuccess" />
  <ClientOnly>
    <ProfileAdminWelcome />
  </ClientOnly>
</template>
