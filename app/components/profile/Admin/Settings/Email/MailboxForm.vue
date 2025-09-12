<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { $profile } = useProfile()
const { showEmailNew, go } = useAdmin()
const { copy: copyPassword, copied: copiedPassword } = useClipboard()

// TODO: add validation
const newMailbox = ref<{ name: string, password: string }>({
  name: '',
  password: '',
})

const isCreatingEmailAddresses = ref(false)
const passwordBackupConfirmed = ref(false)

const passwordConfirmationInput = ref('')
const passwordConfirmed = computed(() => passwordConfirmationInput.value === newMailbox.value.password)

const mailboxNameIsValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._-]+$/
  return newMailbox.value.name.trim() !== '' && emailRegex.test(newMailbox.value.name.trim())
})

function generatePassword() {
  const charset = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#%'
  const passwordLength = 16
  let password = ''
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

async function createEmailAddresses() {
  isCreatingEmailAddresses.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    $profile.mailboxes.push(newMailbox.value.name.trim())
    passwordBackupConfirmed.value = false
    passwordConfirmationInput.value = ''
    newMailbox.value = {
      name: '',
      password: generatePassword(),
    }
    go('#settings/email')
  }
  catch (error) {
    console.error('Error creating email addresses:', error)
  }
  finally {
    isCreatingEmailAddresses.value = false
  }
}

onMounted(() => {
  newMailbox.value.password = generatePassword()
})
</script>

<template>
  <USlideover
    :open="showEmailNew"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: '!p-0',
    }"
    :close="{
      size: 'md',
      onClick: () => {
        go('#settings/email')
      },
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-envelope"
          class="inline-block size-6 opacity-50"
        />
        Neues Postfach anlegen
      </h3>
    </template>

    <template #body>
      <div class="flex flex-col gap-2 p-4">
        <UButtonGroup class="w-full">
          <UInput
            v-model="newMailbox.name"
            placeholder="z.B. kontakt oder info"
            class="w-full"
            size="xl"
            :disabled="isCreatingEmailAddresses"
            :ui="{
              base: 'text-right',
            }"
          />
          <UBadge
            :label="`@${$profile.domain}`"
            color="neutral"
            variant="soft"
            size="xl"
            :ui="{
              base: 'px-4',
            }"
          />
        </UButtonGroup>
        <UFormField label="Passwort">
          <UButtonGroup class="w-full">
            <UBadge
              :label="passwordBackupConfirmed ? '*************' : newMailbox.password"
              class="w-full py-2"
              variant="soft"
              size="xl"
            />
            <UButton
              v-if="!passwordBackupConfirmed"
              :icon="copiedPassword ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
              :label="copiedPassword ? 'Kopiert!' : 'Kopieren'"
              variant="soft"
              @click="copiedPassword ? null : copyPassword(newMailbox.password)"
            />
            <UButton
              v-if="!passwordBackupConfirmed"
              icon="i-heroicons-arrow-path"
              color="primary"
              variant="soft"
              size="xl"
              @click="newMailbox.password = generatePassword()"
            />
          </UButtonGroup>
        </UFormField>
        <USwitch
          v-model="passwordBackupConfirmed"
          label="Ich habe mir das Passwort notiert."
        />
        <UButtonGroup v-if="passwordBackupConfirmed">
          <UInput
            v-model="passwordConfirmationInput"
            placeholder="Passwort zur Bestätigung eingeben"
            class="w-full"
            size="xl"
            @paste.prevent
          />
          <UBadge
            v-if="passwordConfirmationInput !== ''"
            :icon="passwordConfirmed ? 'i-heroicons-check' : 'i-heroicons-x-mark'"
            variant="soft"
            :color="passwordConfirmed ? 'success' : 'error'"
            size="xl"
            :ui="{
              base: 'px-4',
            }"
          />
        </UButtonGroup>
        <UButton
          v-if="mailboxNameIsValid && passwordConfirmed && passwordBackupConfirmed"
          label="E-Mail-Adresse anlegen"
          :disabled="isCreatingEmailAddresses"
          :loading="isCreatingEmailAddresses"
          @click="createEmailAddresses"
        />
      </div>
    </template>
  </USlideover>
</template>
