<script setup lang="ts">
defineProps<{ domain: string }>()

const { $profile } = useProfile()

// TODO: add validation
const newMailboxes = ref<{ name: string; password: string; passwordBackedup: boolean }[]>([
  { name: '', password: '', passwordBackedup: false },
  { name: '', password: '', passwordBackedup: false },
  { name: '', password: '', passwordBackedup: false },
])

const filledEmailFields = computed(() => {
  return newMailboxes.value.filter(mailbox => mailbox.name.trim() !== '').length
})

const mailboxNamesAreValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._-]+$/
  return newMailboxes.value.filter(mailbox => mailbox.name.trim() !== '').every(mailbox => emailRegex.test(mailbox.name.trim()))
})

const passwordsBackupsConfirmed = computed(() => {
  return newMailboxes.value.filter(mailbox => mailbox.passwordBackedup).length === filledEmailFields.value
})

const emailAddressesConfirmed = ref(false)
const isCreatingEmailAddresses = ref(false)

async function createEmailAddresses() {
  isCreatingEmailAddresses.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    $profile.mailboxes.push(...newMailboxes.value.filter(mailbox => mailbox.name.trim() !== '').map(mailbox => mailbox.name.trim()))
  } catch (error) {
    console.error('Error creating email addresses:', error)
  } finally {
    emailAddressesConfirmed.value = false
    isCreatingEmailAddresses.value = false
    newMailboxes.value = []
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    
    <div class="flex flex-col gap-2">
      <ProfileAdminSettingsModalEmailMailboxDetails
        v-for="mailbox in $profile.mailboxes"
        :key="mailbox"
        :mailbox="mailbox"
      />
    </div>
    <ProfileAdminSettingsModalEmailMailboxForm
      v-for="index in 3 - $profile.mailboxes.length"
      v-model:mailbox="newMailboxes[index].name"
      v-model:password="newMailboxes[index].password"
      v-model:password-backedup="newMailboxes[index].passwordBackedup"
      :key="index"
      :disabled="isCreatingEmailAddresses"
      :domain="domain"
      class="flex flex-col gap-2"
    />
    <USwitch
      v-if="mailboxNamesAreValid && filledEmailFields > 0"
      v-model="emailAddressesConfirmed"
      label="Ja, ich möchte diese E-Mail-Adressen anlegen."
      :disabled="isCreatingEmailAddresses"
    />
    <UButton
      v-if="$profile.mailboxes.length < 3"
      :label="`${filledEmailFields} E-Mail-Adresse${filledEmailFields === 1 ? '' : 'n'} anlegen`"
      :disabled="filledEmailFields === 0 || !mailboxNamesAreValid || isCreatingEmailAddresses || !emailAddressesConfirmed || !passwordsBackupsConfirmed"
      :loading="isCreatingEmailAddresses"
      @click="createEmailAddresses"
    />
  </div>
</template>
