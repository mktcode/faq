<script setup lang="ts">
const emit = defineEmits(['goToSubscription'])

const email1 = ref('')
const email2 = ref('')
const email3 = ref('')

const { data: mailboxes } = await useFetch('/api/user/email/list')

const filledEmailFields = computed(() => {
  return [email1.value, email2.value, email3.value].filter(email => email.trim() !== '').length
})

const mailboxNamesAreValid = computed(() => {
  const emailRegex = /^[a-zA-Z0-9._-]+$/
  return [email1.value, email2.value, email3.value].filter(email => email.trim() !== '').every(email => emailRegex.test(email.trim()))
})

const emailAddressesConfirmed = ref(false)

const isCreatingEmailAddresses = ref(false)

async function createEmailAddresses() {
  isCreatingEmailAddresses.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
  } catch (error) {
    console.error('Error creating email addresses:', error)
  } finally {
    emailAddressesConfirmed.value = false
    isCreatingEmailAddresses.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <AdminSettingsModalDomainEmailDetails
      v-for="email in mailboxes"
      :key="email.email_address"
      :email="email.email_address"
    />
    <UFormField
      label="E-Mail-Adressen anlegen"
      description="Legen Sie bis zu drei E-Mail-Adressen an."
      :ui="{
        container: 'flex flex-col gap-2',
      }"
    >
      <UButtonGroup class="w-full">
        <UInput
          v-model="email1"
          placeholder="z.B. kontakt oder info"
          class="w-full"
          size="xxl"
          :disabled="isCreatingEmailAddresses"
        />
        <UBadge
          :label="`@${me?.domain}`"
          color="neutral"
          variant="soft"
          size="xl"
          :ui="{
            base: 'px-4',
          }"
        />
      </UButtonGroup>
      <UButtonGroup class="w-full">
        <UInput
          v-model="email2"
          placeholder="z.B. bestellung"
          class="w-full"
          size="xxl"
          :disabled="isCreatingEmailAddresses"
        />
        <UBadge
          :label="`@${me?.domain}`"
          color="neutral"
          variant="soft"
          size="xl"
          :ui="{
            base: 'px-4',
          }"
        />
      </UButtonGroup>
      <UButtonGroup class="w-full">
        <UInput
          v-model="email3"
          placeholder="z.B. anfrage"
          class="w-full"
          size="xxl"
          :disabled="isCreatingEmailAddresses"
        />
        <UBadge
          :label="`@${me?.domain}`"
          color="neutral"
          variant="soft"
          size="xl"
          :ui="{
            base: 'px-4',
          }"
        />
      </UButtonGroup>
    </UFormField>
    <USwitch
      v-if="mailboxNamesAreValid && filledEmailFields > 0"
      v-model="emailAddressesConfirmed"
      label="Ja, ich möchte diese E-Mail-Adressen anlegen."
      :disabled="isCreatingEmailAddresses"
    />
    <UButton
      :label="`${filledEmailFields} E-Mail-Adresse${filledEmailFields === 1 ? '' : 'n'} anlegen`"
      :disabled="filledEmailFields === 0 || !mailboxNamesAreValid || isCreatingEmailAddresses || !emailAddressesConfirmed"
      :loading="isCreatingEmailAddresses"
      @click="createEmailAddresses"
    />
  </div>
</template>
