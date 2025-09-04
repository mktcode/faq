<script setup lang="ts">
defineProps<{ domain: string }>()

const { $profile } = useProfile()

// TODO: add validation
const newMailbox = ref<{ name: string, password: string, passwordBackedup: boolean }>({
  name: '',
  password: '',
  passwordBackedup: false
})

const mailboxNamesIsValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._-]+$/
  return newMailbox.value.name.trim() !== '' && emailRegex.test(newMailbox.value.name.trim())
})

const passwordBackupConfirmed = computed(() => {
  return newMailbox.value.passwordBackedup
})

const emailAddressesConfirmed = ref(false)
const isCreatingEmailAddresses = ref(false)

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
    newMailbox.value = {
      name: '',
      password: '',
      passwordBackedup: false
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex flex-col gap-2">
      <ProfileAdminSettingsEmailMailboxDetails
        v-for="mailbox in $profile.mailboxes"
        :key="mailbox"
        :mailbox="mailbox"
      />
    </div>
    <ProfileAdminSettingsEmailMailboxForm
      v-model:mailbox="newMailbox.name"
      v-model:password="newMailbox.password"
      v-model:password-backedup="newMailbox.passwordBackedup"
      :disabled="isCreatingEmailAddresses"
      :domain="domain"
      class="flex flex-col gap-2"
    />
    <USwitch
      v-if="mailboxNamesIsValid"
      v-model="emailAddressesConfirmed"
      label="Ja, ich möchte diese E-Mail-Adresse anlegen."
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
