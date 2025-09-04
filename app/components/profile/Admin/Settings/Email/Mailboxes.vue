<script setup lang="ts">
const { $profile } = useProfile()

const hasFreeMailboxSlots = computed(() => {
  const mailboxLimit = $profile.subscription.plan === 'S'
    ? 1
    : $profile.subscription.plan === 'L' ? 3 : 0

  return $profile.mailboxes.length < mailboxLimit
})
</script>

<template>
  <div class="flex flex-col">
    <TransitionGroup name="list">
      <ProfileAdminSettingsEmailMailboxDetails
        v-for="mailbox in $profile.mailboxes"
        :key="mailbox"
        :mailbox="mailbox"
      />
    </TransitionGroup>
    <ProfileAdminSettingsEmailMailboxForm v-if="hasFreeMailboxSlots" />
  </div>
</template>
