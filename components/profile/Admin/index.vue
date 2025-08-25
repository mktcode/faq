<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess
</script>

<template>
  <ProfileAdminNav />
  <ProfileAdminDesignModal />
  <ProfileAdminContentModal />
  <ProfileAdminFeedbackModal />
  <ProfileAdminEmailVerifiedModal v-if="emailVerified" />
  <ProfileAdminSubscriptionSuccessModal v-if="subscriptionSuccess" />
  <ClientOnly>
    <ProfileAdminWelcomeModal />
  </ClientOnly>
</template>
