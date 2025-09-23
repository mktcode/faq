<script setup lang="ts">
const toast = useToast()

const refreshInterval = ref<NodeJS.Timeout | null>(null)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

function generateOneTimePassword() {
  const oneTimePasswordCharacters = '2346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrstuvwxyz'

  return Array.from({ length: 8 }, () =>
    oneTimePasswordCharacters.charAt(Math.floor(Math.random() * oneTimePasswordCharacters.length))
  ).join('')
}

const { showConnectDevice, go } = useAdmin()

const { data: devices, refresh: refreshDevices } = await useFetch('/api/user/devices')
const { data: currentOtp, refresh: refreshCurrentOtp } = await useFetch('/api/user/connect/otp')

const deletingDeviceIds = ref<string[]>([])
async function deleteDevice(credentialId: string) {
  deletingDeviceIds.value.push(credentialId)

  try {
    await $fetch('/api/user/devices/delete', {
      method: 'POST',
      body: {
        credentialId
      }
    })

    await refreshDevices()

    toast.add({
      title: 'Gerät entfernt',
      icon: 'i-heroicons-check-circle',
      description: 'Das Gerät wurde erfolgreich entfernt.',
      color: 'success',
      progress: false,
    })
  } catch (error) {
    console.error('Error deleting device:', error)
    toast.add({
      title: 'Fehler',
      icon: 'i-heroicons-x-circle',
      description: 'Das Gerät konnte nicht entfernt werden.',
      color: 'error',
      progress: false,
    })
  }
  finally {
    deletingDeviceIds.value = deletingDeviceIds.value.filter(id => id !== credentialId)
  }
}

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
      refreshDevices()
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
        Verknüpfte Geräte
      </h3>
    </template>

    <template #body>
      <DismissableAlert
        title="Auf einem anderen Gerät anmelden"
        icon="i-lucide-info"
        storage-key="otp-info-dismissed"
        class="rounded-none"
      >
        Um sich auf einem anderen Gerät anzumelden, müssen Sie dieses zunächst über ein Einmal-Passwort verknüpfen. Klicken Sie dazu auf "Gerät verknüpfen", um ein neues Einmal-Passwort zu generieren. Melden Sie sich anschließend innerhalb der nächsten 15 Minuten auf dem neuen Gerät mit Ihrem Benutzernamen und dem Einmal-Passwort an.
      </DismissableAlert>
      <div class="mb-4">
        <div
          v-for="device in devices"
          :key="device.credentialId"
          class="border-b border-neutral-200 p-4 flex gap-2 items-center"
        >
          <div class="flex flex-col flex-1">
            {{ device.credentialNickname }}
            <div class="text-sm text-neutral-400">
              Erste Anmeldung:
              {{ new Date(device.createdAt).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }) }}
            </div>
          </div>
          <UBadge
            v-if="device.credentialId.endsWith('k')"
            color="neutral"
            variant="soft"
            class="whitespace-nowrap"
            size="xl"
          >
            dieses Gerät
          </UBadge>
          <UButton
            v-else
            icon="i-heroicons-trash"
            variant="soft"
            color="error"
            :loading="deletingDeviceIds.includes(device.credentialId)"
            @click="deleteDevice(device.credentialId)"
          />
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
