<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess
</script>

<template>
  <ClientOnly>
    <AdminWelcomeModal />
  </ClientOnly>
  <ProfileDefaultAdminNav />
  <AdminDesignModal />
  <AdminContentModal />
  <AdminLinksModal />
  <AdminFeedbackModal />
  <AdminEmailVerifiedModal v-if="emailVerified" />
  <AdminSubscriptionSuccessModal v-if="subscriptionSuccess" />
</template>