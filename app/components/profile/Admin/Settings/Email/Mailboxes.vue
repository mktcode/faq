<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex flex-col gap-2">
      <ProfileAdminSettingsEmailMailboxDetails
        v-for="mailbox in $profile.mailboxes"
        :key="mailbox"
        :mailbox="mailbox"
      />
    </div>
    <ProfileAdminSettingsEmailMailboxForm />
  </div>
</template>
