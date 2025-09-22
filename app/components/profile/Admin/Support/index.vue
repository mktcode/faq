<script setup lang="ts">
const { showSupport, go } = useAdmin()
const router = useRouter()

const { hasUnreadMessages } = useUnreadMessages()
</script>

<template>
  <USlideover
    :open="showSupport"
    side="right"
    :close="{
      size: 'md',
      onClick: () => {
        go('')
      },
    }"
    :ui="{
      wrapper: 'z-40',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
      body: '!p-0',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-message-circle-question-mark"
          class="inline-block size-6 opacity-50"
        />
        IT-Support
      </h3>
    </template>

    <template #body>
      <UButton
        label="Termin reservieren"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        icon="i-lucide-calendar-check"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="$profile.subscription.plan ? go('#support/book') : go('#settings/subscription')"
      >
        <template #trailing>
          <div class="ml-auto flex items-center gap-2">
            <UBadge
              v-if="!$profile.subscription.plan"
              label="Premium"
              variant="outline"
            />
            <UIcon
              name="i-heroicons-chevron-right"
              class="size-6 opacity-30"
            />
          </div>
        </template>
      </UButton>

      <UButton
        label="Telefon & E-Mail"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        icon="i-lucide-phone"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="router.push({ hash: '#support/phone-mail' })"
      />

      <UButton
        label="Fernwartung"
        icon="i-lucide-laptop-minimal-check"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="router.push({ hash: '#support/remote' })"
      />

      <UButton
        icon="i-lucide-messages-square"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="router.push({ hash: '#support/livechat' })"
      >
        Live-Chat
        <UChip
          v-if="hasUnreadMessages"
          class="animate-ping ml-2"
          size="xl"
        />
      </UButton>

      <UButton
        label="Unterstützen Sie uns"
        icon="i-lucide-heart"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="router.push({ hash: '#support/payment' })"
      />

      <ProfileAdminSupportPhoneMail />
      <ProfileAdminSupportRemote />
      <ProfileAdminSupportBook />
      <ProfileAdminSupportLiveChat />
      <ProfileAdminSupportPayment />
    </template>
  </USlideover>
</template>
