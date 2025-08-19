<script setup lang="ts">
const { me } = await useMe()
const emit = defineEmits(['goToSubscription'])

const email1 = ref('')
const email2 = ref('')
const email3 = ref('')

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
  <div class="flex flex-col gap-4 p-6">
    <template v-if="me?.isSubscribed">
      <template v-if="me?.domain && !me?.domainIsExternal">
        <div class="flex items-center gap-4 bg-primary-600/10 border border-primary-500/20 rounded-lg px-4 py-3">
          <UIcon
            name="i-heroicons-check"
            class="text-primary-500 size-6 shrink-0"
          />
          <div>
            Ihre Domain <strong>{{ me?.domain }}</strong> ist verbunden.
          </div>
        </div>
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
      </template>
      <div
        v-if="me?.domain && me?.domainIsExternal"
        class="flex items-center gap-4 bg-primary-600/10 border border-primary-500/20 rounded-lg px-4 py-3"
      >
        <UIcon
          name="i-heroicons-check"
          class="text-primary-500 size-6 shrink-0"
        />
        <div>
          Ihre extern registrierte Domain <strong>{{ me?.domain }}</strong> ist verbunden.
        </div>
      </div>
      <SettingsModalDomainNewSetup v-if="!me?.domain || me?.domainIsExternal" />
      <SettingsModalDomainExistingSetup v-if="!me?.domain || me?.domainIsExternal" />
    </template>
    <template v-else>
      <p
        v-if="me?.domain"
        class="text-gray-500"
      >
        Ihre Website ist unter <strong>{{ me?.domain }}</strong> erreichbar. Benötigen Sie noch eine passende E-Mail-Adresse,
        z.B. <strong>info@{{ me?.domain }}</strong>?
      </p>
      <p
        v-else
        class="text-gray-500"
      >
        Ihre Website ist aktuell unter <strong>{{ me?.userName }}.solihost.de</strong> erreichbar.
        Eine eigene Domain und ein E-Mail-Postfach sind in unserem <strong>Abonnement</strong> inklusive.
        Wenn Sie bereits eine Domain besitzen, können Sie diese für Ihre Website bei uns nutzen.
      </p>

      <UButton
        :label="me?.domain ? `Abonnieren und E-Mail-Postfach anlegen` : `Abonnieren und neue Domain registrieren`"
        trailing-icon="i-heroicons-rocket-launch"
        color="primary"
        :ui="{
          trailingIcon: 'ml-auto',
        }"
        @click="emit('goToSubscription')"
      />
      <SettingsModalDomainExistingSetup />
    </template>
  </div>
</template>
