<script setup lang="ts">
const route = useRoute()
const subscriptionSuccess = !!route.query.subscriptionSuccess
</script>

<template>
  <ProfileAdminNav />
  <ProfileAdminSettings />
  <ProfileAdminWebsite />
  <ProfileAdminWebsiteDesign />
  <ProfileAdminWebsiteFiles />
  <ProfileAdminWebsitePage />
  <ProfileAdminWebsiteTemplates />
  <ProfileAdminWebsiteStore />
  <ProfileAdminWebsitePages />
  <ProfileAdminWebsiteComponent />
  <ProfileAdminAssistant />
  <ProfileAdminSupport />
  <ProfileAdminSubscriptionSuccess v-if="subscriptionSuccess" />
  <ProfileAdminWelcome />
</template>
