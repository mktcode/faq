<script setup lang="ts">
const { showSupport } = useAdmin()
const router = useRouter()
</script>

<template>
  <USlideover
    v-model:open="showSupport"
    side="right"
    :close="{
      size: 'md',
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
        Hilfe
      </h3>
    </template>

    <template #body>
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
        label="Live-Chat"
        icon="i-lucide-messages-square"
        class="w-full rounded-none p-4 border-b border-gray-200"
        variant="ghost"
        color="neutral"
        trailing-icon="i-heroicons-chevron-right"
        :ui="{
          trailingIcon: 'ml-auto opacity-30',
        }"
        @click="router.push({ hash: '#support/livechat' })"
      />

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
        @click="router.push({ hash: '#support/livechat' })"
      />

      <ProfileAdminSupportPhoneMail />
      <ProfileAdminSupportRemote />
      <ProfileAdminSupportLiveChat />
    </template>
  </USlideover>
</template>
