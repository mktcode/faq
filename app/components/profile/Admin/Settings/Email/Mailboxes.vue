<script setup lang="ts">
const { $profile } = useProfile()
const { go } = useAdmin()

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
    <UButton
      label="Neues Postfach anlegen"
      icon="i-heroicons-plus"
      class="w-full rounded-none p-4 border-b border-gray-200"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-right"
      :ui="{
        trailingIcon: `ml-auto`,
      }"
      @click="go('#settings/email/new')"
    />
    <ProfileAdminSettingsEmailMailboxForm v-if="hasFreeMailboxSlots" />
  </div>
</template>
