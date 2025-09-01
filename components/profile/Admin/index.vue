<script setup lang="ts">
const route = useRoute()
const subscriptionSuccess = !!route.query.subscriptionSuccess

// Initialize admin hash navigation only while Admin is mounted
useAdminHashNav()
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
  <ProfileAdminSubscriptionSuccess v-if="subscriptionSuccess" />
  <ClientOnly>
    <ProfileAdminWelcome />
  </ClientOnly>
</template>
