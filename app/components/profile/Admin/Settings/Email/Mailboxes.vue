<template>
  <div class="flex flex-col">
    <TransitionGroup name="list">
      <ProfileAdminSettingsEmailMailboxDetails
        v-for="mailbox in $profile.mailboxes"
        :key="mailbox"
        :mailbox="mailbox"
      />
    </TransitionGroup>
    <ProfileAdminSettingsEmailMailboxForm />
  </div>
</template>
