<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { copy: copyPassword, copied: copiedPassword } = useClipboard()

defineProps<{
  domain: string
  disabled: boolean
}>()

const mailbox = defineModel('mailbox', {
  type: String,
  default: '',
})

const password = defineModel('password', {
  type: String,
  default: '',
})

const passwordBackedup = defineModel('passwordBackedup', {
  type: Boolean,
  default: false,
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

onMounted(() => {
  password.value = generatePassword()
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <UButtonGroup class="w-full">
      <UInput
        v-model="mailbox"
        placeholder="z.B. kontakt oder info"
        class="w-full"
        size="xl"
        :disabled="disabled"
      />
      <UBadge
        :label="`@${domain}`"
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
          :label="password"
          class="w-full"
          variant="soft"
          size="lg"
        />
        <UButton
          :icon="copiedPassword ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
          :label="copiedPassword ? 'Kopiert!' : 'Kopieren'"
          @click="copiedPassword ? null : copyPassword(password)"
          variant="soft"
        />
        <UButton
          icon="i-heroicons-arrow-path"
          color="primary"
          variant="soft"
          size="xl"
          @click="password = generatePassword()"
        />
      </UButtonGroup>
    </UFormField>
    <USwitch
      v-model="passwordBackedup"
      label="Ich habe mir das Passwort notiert."
    />
  </div>
</template>
