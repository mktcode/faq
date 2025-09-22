<script setup lang="ts">
const { go } = useAdmin()
const { unsavedSettings } = useProfile()

const { hasUnreadMessages } = useUnreadMessages()
const { data: liveChatData, refresh: refreshLiveChatData } = await useFetch('/api/user/livechat/list-conversations')

const refreshLiveChatDataInterval = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
  refreshLiveChatDataInterval.value = setInterval(refreshLiveChatData, 30_000)
})

watch(liveChatData, (newValue) => {
  if (newValue) {
    hasUnreadMessages.value = newValue.hasUnreadMessages
  }
}, { immediate: true })
</script>

<template>
  <div class="fixed w-full bottom-0 md:bottom-auto md:top-0 z-20 bg-white/90 saturate-150 backdrop-blur-lg md:p-2 flex md:gap-1 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
    <UButton
      icon="i-heroicons-cog-6-tooth"
      variant="ghost"
      label="Einstellungen"
      :ui="{
        base: 'flex-col md:flex-row text-sm md:text-base font-light rounded-none md:rounded-lg',
      }"
      @click="go('#settings')"
    />
    <UButton
      icon="i-lucide-monitor-smartphone"
      variant="ghost"
      label="Website"
      :ui="{
        base: 'flex-col md:flex-row text-sm md:text-base font-light rounded-none md:rounded-lg relative',
      }"
      @click="go('#website')"
    >
      Website
      <UChip
        v-if="unsavedSettings"
        class="absolute top-5 md:left-6 animate-ping"
        size="xl"
      />
    </UButton>
    <!-- <UButton
      icon="i-lucide-bot"
      variant="ghost"
      label="Assistent"
      :ui="{
        base: 'flex-col md:flex-row text-sm md:text-base font-light rounded-none md:rounded-lg',
      }"
      @click="go($profile.subscription.plan ? '#assistant' : '#settings/subscription')"
    /> -->
    <UButton
      icon="i-lucide-message-circle-question-mark"
      variant="ghost"
      class="ml-auto"
      :ui="{
        base: 'flex-col md:flex-row text-sm md:text-base font-light rounded-none md:rounded-lg relative',
      }"
      @click="go('#support')"
    >
      IT-Support
      <UChip
        v-if="liveChatData?.hasUnreadMessages"
        class="absolute top-5 md:left-6 animate-ping"
        size="xl"
      />
    </UButton>
  </div>
</template>
