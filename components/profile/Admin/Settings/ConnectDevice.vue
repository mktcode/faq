<script setup lang="ts">
const { showConnectDevice, go } = useAdmin()

const oneTimePassword = ref('')
const oneTimePasswordCharacters = '2346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrstuvwxyz'
const oneTimePasswordSet = ref(false)
const isSettingOneTimePassword = ref(false)
const countdown = ref(15 * 60)
const countdownLabel = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const devices = ref<{ label: string; id: string }[]>([
  { label: 'Smartphone', id: 'device-1' },
])

function generateOneTimePassword() {
  oneTimePassword.value = Array.from({ length: 8 }, () =>
    oneTimePasswordCharacters.charAt(Math.floor(Math.random() * oneTimePasswordCharacters.length))
  ).join('')
}

function startCountdown() {
  countdown.value = 15 * 60
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

async function setOneTimePassword() {
  isSettingOneTimePassword.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  oneTimePasswordSet.value = true
  isSettingOneTimePassword.value = false
  startCountdown()
}

onMounted(generateOneTimePassword)
</script>

<template>
  <USlideover
    :open="showConnectDevice"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :close="{
      size: 'md',
      onClick: () => {
        go('#settings')
      },
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-finger-print"
          class="inline-block size-6 opacity-50"
        />
        Gerät verknüpfen
      </h3>
    </template>

    <template #body>
      <div class="mb-4">
        <div
          v-for="device in devices"
          :key="device.id"
          class="text-sm text-neutral-500 border border-neutral-200 rounded p-2 mb-2 flex gap-2"
        >
          {{ device.label }}
          <span class="text-neutral-400 font-semibold ml-auto">
            dieses Gerät
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <UButtonGroup>
          <UBadge
            :label="oneTimePassword"
            variant="soft"
            color="neutral"
            size="xl"
            class="flex-1 font-mono text-2xl p-4 justify-center"
          />
          <UBadge
            v-if="oneTimePasswordSet"
            :label="countdownLabel"
            variant="soft"
            color="neutral"
            size="xl"
          />
          <UButton
            v-if="!oneTimePasswordSet"
            icon="i-heroicons-arrow-path"
            variant="soft"
            @click="generateOneTimePassword"
            class="px-4"
          />
        </UButtonGroup>
        <UAlert
          v-if="oneTimePasswordSet"
          icon="i-lucide-loader-circle"
          title="Gerät verknüpfen"
          :description="`Melden Sie sich nun innerhalb der nächsten 15 Minuten auf dem neuen Gerät mit Ihrem Benutzernamen '${$profile.username}' an und geben Sie das Einmalpasswort ein.`"
          variant="soft"
          :ui="{
            icon: 'animate-spin',
          }"
        />
        <UButton
          v-if="!oneTimePasswordSet"
          label="Gerät verknüpfen"
          icon="i-lucide-unplug"
          variant="solid"
          color="primary"
          class="w-full"
          :loading="isSettingOneTimePassword"
          :ui="{
            base: 'justify-center',
          }"
          @click="setOneTimePassword"
        />
      </div>
    </template>
  </USlideover>
</template>
