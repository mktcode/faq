<script setup lang="ts">
const route = useRoute()
const emailVerified = !!route.query.emailVerified
const subscriptionSuccess = !!route.query.subscriptionSuccess
</script>

<template>
  <ClientOnly>
    <WelcomeModal />
  </ClientOnly>
  <ProfileDefaultAdminNav />
  <DesignModal />
  <ContentModal />
  <LinksModal />
  <FeedbackModal />
  <EmailVerifiedModal v-if="emailVerified" />
  <SubscriptionSuccessModal v-if="subscriptionSuccess" />
</template>