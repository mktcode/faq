<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { $profile } = useProfile()
const { copy: copyPassword, copied: copiedPassword } = useClipboard()

// TODO: add validation
const newMailbox = ref<{ name: string, password: string }>({
  name: '',
  password: '',
})

const emailAddressesConfirmed = ref(false)
const isCreatingEmailAddresses = ref(false)
const passwordBackupConfirmed = ref(false)

const mailboxNamesIsValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._-]+$/
  return newMailbox.value.name.trim() !== '' && emailRegex.test(newMailbox.value.name.trim())
})

function generatePassword() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
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
  }
  catch (error) {
    console.error('Error creating email addresses:', error)
  }
  finally {
    emailAddressesConfirmed.value = false
    isCreatingEmailAddresses.value = false
    passwordBackupConfirmed.value = false
    newMailbox.value = {
      name: '',
      password: generatePassword(),
    }
  }
}

onMounted(() => {
  newMailbox.value.password = generatePassword()
})

const open = ref(false)
</script>

<template>
  <UCollapsible
    v-model:open="open"
    class="flex flex-col gap-2"
    :ui="{
      root: 'border-b border-gray-200',
      content: 'flex flex-col gap-2 p-2',
    }"
  >
    <template #default>
      <div class="flex items-center">
        <UButton
          label="Neues Postfach anlegen"
          class="w-full rounded-none p-4"
          variant="ghost"
          color="neutral"
          trailing-icon="i-heroicons-chevron-down"
          :ui="{
            trailingIcon: `ml-auto transition-transform ${open ? 'rotate-180' : ''}`,
          }"
        />
      </div>
    </template>

    <template #content>
      <div class="flex flex-col gap-2">
        <UButtonGroup class="w-full">
          <UInput
            v-model="newMailbox.name"
            placeholder="z.B. kontakt oder info"
            class="w-full"
            size="xl"
            :disabled="isCreatingEmailAddresses"
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
              :label="newMailbox.password"
              class="w-full"
              variant="soft"
              size="lg"
            />
            <UButton
              :icon="copiedPassword ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
              :label="copiedPassword ? 'Kopiert!' : 'Kopieren'"
              variant="soft"
              @click="copiedPassword ? null : copyPassword(newMailbox.password)"
            />
            <UButton
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
        <USwitch
          v-if="mailboxNamesIsValid"
          v-model="emailAddressesConfirmed"
          :label="`Ja, ich möchte die E-Mail-Adresse ${newMailbox.name}@$${$profile.domain} anlegen.`"
          :disabled="isCreatingEmailAddresses"
        />
        <UButton
          v-if="$profile.mailboxes.length < 3"
          label="E-Mail-Adresse anlegen"
          :disabled="isCreatingEmailAddresses || !emailAddressesConfirmed || !passwordBackupConfirmed"
          :loading="isCreatingEmailAddresses"
          @click="createEmailAddresses"
        />
      </div>
    </template>
  </UCollapsible>
</template>
