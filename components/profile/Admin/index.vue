<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess
</script>

<template>
  <ProfileMainAdminNav />
  <AdminDesignModal />
  <AdminContentModal />
  <AdminFeedbackModal />
  <AdminEmailVerifiedModal v-if="emailVerified" />
  <AdminSubscriptionSuccessModal v-if="subscriptionSuccess" />
  <ClientOnly>
    <AdminWelcomeModal />
  </ClientOnly>
</template>