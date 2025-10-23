<script setup lang="ts">
const { go, hideNav } = useAdmin()
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
  <UButton
    icon="i-lucide-pencil"
    class="fixed bottom-3 md:bottom-auto md:top-3 left-3 z-[60] rounded-full"
    size="sm"
    variant="soft"
    @click="hideNav = !hideNav"
  />
  <div
    class="fixed w-full bottom-0 md:bottom-auto md:top-0 z-[60] bg-white/90 saturate-150 backdrop-blur-lg md:p-2 flex md:gap-1 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-transform"
    :class="hideNav ? 'translate-y-full md:-translate-y-full' : 'translate-y-0'"
  >
    <UButton
      icon="i-lucide-minus"
      variant="link"
      color="neutral"
      class="opacity-30 hover:opacity-100 transition-opacity mt-auto md:mb-auto"
      :ui="{
        base: 'flex-col md:flex-row text-sm md:text-base font-light rounded-none md:rounded-lg',
      }"
      @click="hideNav = !hideNav"
    />
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
    <UButton
      icon="i-lucide-message-circle-question-mark"
      variant="ghost"
      class="ml-auto"
      :ui="{
        base: 'flex-col md:flex-row text-sm md:text-base font-light rounded-none md:rounded-lg relative',
      }"
      @click="go('#support')"
    >
      Support
      <UChip
        v-if="liveChatData?.hasUnreadMessages"
        class="absolute top-5 md:left-6 animate-ping"
        size="xl"
      />
    </UButton>
  </div>
</template>
