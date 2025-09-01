<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { showSupportPhoneMail } = useAdmin()

const { user } = useUserSession()
const { copy: copySupportId, copied: copiedSupportId } = useClipboard()
const { copy: copyEmail, copied: copiedEmail } = useClipboard()
const { copy: copyPhone, copied: copiedPhone } = useClipboard()

const supportEmail = 'support@solohost.de'
const supportPhone = '+49 123 4567890'
</script>

<template>
  <USlideover
    v-model:open="showSupportPhoneMail"
    side="right"
    :overlay="false"
    close-icon="i-heroicons-arrow-left"
    :close="{
      size: 'md',
    }"
    :ui="{
      wrapper: 'z-40',
      overlay: 'backdrop-blur-xs',
      footer: 'justify-between',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-phone"
          class="inline-block size-6 opacity-50"
        />
        Telefon &amp; E-Mail
      </h3>
    </template>

    <template #body>
      <p class="mb-4">
        Wenn Sie uns telefonisch oder per E-Mail kontaktieren, geben Sie bitte Ihre Support-ID an.
      </p>
      <div
        v-if="user"
        class="p-2 border border-gray-200 rounded-xl font-mono text-2xl bg-gray-50 flex items-center justify-between"
      >
        <div>
          <div class="text-sm text-gray-500">
            Support-ID:
          </div>
          {{ user.id }}
        </div>
        <UButton
          variant="soft"
          @click="copySupportId(user.id.toString())"
        >
          {{ copiedSupportId ? 'Kopiert!' : 'Kopieren' }}
        </UButton>
      </div>
      <div class="mt-6 border border-gray-200 rounded-xl p-2">
        <div class="mb-4 font-semibold text-xl text-center flex items-center justify-center">
          <UIcon
            name="i-heroicons-phone"
            class="inline-block size-6 opacity-50 mr-2"
          />
          {{ supportPhone }}
        </div>
        <div class="flex gap-2">
          <UButton
            variant="soft"
            :label="copiedPhone ? 'Kopiert!' : 'Kopieren'"
            @click="copyPhone(supportPhone)"
          />
          <UButton
            label="Anrufen"
            :href="`tel:${supportPhone.replaceAll(' ', '')}`"
            block
          />
        </div>
      </div>
      <div class="mt-6 border border-gray-200 rounded-xl p-2">
        <div class="mb-4 font-semibold text-xl text-center flex items-center justify-center">
          <UIcon
            name="i-heroicons-envelope"
            class="inline-block size-6 opacity-50 mr-2"
          />
          {{ supportEmail }}
        </div>
        <div class="flex gap-2">
          <UButton
            variant="soft"
            :label="copiedEmail ? 'Kopiert!' : 'Kopieren'"
            @click="copyEmail(supportEmail)"
          />
          <UButton
            label="Mein E-Mail-Programm öffnen"
            :href="`mailto:${supportEmail}`"
            block
          />
        </div>
      </div>
    </template>
  </USlideover>
</template>
