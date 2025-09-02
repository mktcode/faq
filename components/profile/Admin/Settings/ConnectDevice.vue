<script setup lang="ts">
const refreshInterval = ref<NodeJS.Timeout | null>(null)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

function generateOneTimePassword() {
  const oneTimePasswordCharacters = '2346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrstuvwxyz'

  return Array.from({ length: 8 }, () =>
    oneTimePasswordCharacters.charAt(Math.floor(Math.random() * oneTimePasswordCharacters.length))
  ).join('')
}

const { showConnectDevice, go } = useAdmin()

const devices = ref<{ label: string; id: string }[]>([
  { label: 'Smartphone', id: 'device-1' },
])

const { data: currentOtp, refresh: refreshCurrentOtp } = await useFetch('/api/user/connect/otp')

const oneTimePassword = ref(currentOtp.value?.otp || generateOneTimePassword())
const secondsLeft = ref(currentOtp.value?.secondsLeft || 0)
const countdownLabel = computed(() => {
  const minutes = Math.floor(secondsLeft.value / 60)
  const seconds = secondsLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const isSettingOneTimePassword = ref(false)
async function setOneTimePassword() {
  isSettingOneTimePassword.value = true

  await $fetch('/api/user/connect/otp', {
    method: 'POST',
    body: {
      otp: oneTimePassword.value
    }
  })

  await refreshCurrentOtp()
  stopCountdown()
  secondsLeft.value = currentOtp.value?.secondsLeft || 0
  startCountdown()

  isSettingOneTimePassword.value = false
}

function startCountdown() {
  countdownInterval.value = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value--
    } else {
      stopCountdown()
    }
  }, 1000)
}

function stopCountdown() {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
}

onMounted(() => {
  if (currentOtp.value?.secondsLeft) {
    startCountdown()
  }

  refreshInterval.value = setInterval(() => {
    if (currentOtp.value?.otp) {
      refreshCurrentOtp()
    }
  }, 5000)
})

onBeforeUnmount(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})
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
    :ui="{
      body: '!p-0',
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
      <DismissableAlert
        title="Auf einem anderen Gerät anmelden"
        icon="i-lucide-info"
        storage-key="otp-info-dismissed"
        class="rounded-none"
      >
        Um sich auf einem anderen Gerät anzumelden, müssen Sie dieses zunächst über ein Einmal-Passwort verknüpfen. Klicken Sie dazu auf "Gerät verknüpfen", um ein neues Einmal-Passwort zu generieren. Melden Sie sich anschließend innerhalb der nächsten 15 Minuten auf dem neuen Gerät mit Ihrem Benutzernamen und dem Ein
      </DismissableAlert>
      <div class="mb-4">
        <div
          v-for="device in devices"
          :key="device.id"
          class="text-lg text-neutral-500 border-b border-neutral-200 p-4 mb-2 flex gap-2"
        >
          {{ device.label }}
          <span class="text-neutral-400 font-semibold ml-auto">
            dieses Gerät
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-2 p-4">
        <UButtonGroup v-if="currentOtp?.otp">
          <UBadge
            :label="oneTimePassword"
            variant="soft"
            color="neutral"
            size="xl"
            class="flex-1 font-mono text-2xl p-4 justify-center"
          />
          <UBadge
            :label="countdownLabel"
            variant="soft"
            color="neutral"
            size="xl"
          />
        </UButtonGroup>
        <UAlert
          v-if="currentOtp?.otp"
          icon="i-lucide-loader-circle"
          title="Gerät verknüpfen"
          :description="`Melden Sie sich nun innerhalb der nächsten 15 Minuten auf dem neuen Gerät mit Ihrem Benutzernamen '${$profile.username}' und dem Einmalpasswort an.`"
          variant="soft"
          :ui="{
            icon: 'animate-spin',
          }"
        />
        <UButton
          v-if="!currentOtp?.otp"
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
