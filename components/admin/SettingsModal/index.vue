<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const toast = useToast()
const showModal = useState('showSettingsModal', () => false)

const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

const showLegalDataWarning = computed(() => {
  return !$profile.settings.company.name || !$profile.settings.company.street || !$profile.settings.company.phone
})

async function togglePublished() {
  const { published } = await $fetch('/api/user/togglePublished', { method: 'POST' })

  if (published) {
    toast.add({
      title: 'Profil veröffentlicht',
      description: `Dein Profil ist jetzt öffentlich zugänglich.`,
      color: 'success',
    })
  }
  else {
    toast.add({
      title: 'Profil nicht mehr veröffentlicht',
      description: `Dein Profil ist jetzt privat.`,
      color: 'warning',
    })
  }
}

const items: AccordionItem[] = [
  {
    label: 'Anschrift und Rechtliches',
    icon: 'i-heroicons-building-office-2',
    slot: 'company',
  },
  {
    label: 'Domain',
    icon: 'i-heroicons-globe-alt',
    slot: 'domain',
  },
  {
    label: 'E-Mail',
    icon: 'i-heroicons-envelope',
    slot: 'email',
    disabled: !$profile.isSubscribed
  },
  {
    label: 'Abonnement',
    icon: 'i-heroicons-rocket-launch',
    slot: 'subscription',
  },
]

const active = ref<string | undefined>(undefined)
</script>

<template>
  <USlideover
    v-model:open="showModal"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: '!p-0',
    }"
    :close="{
      size: 'md',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-cog-6-tooth"
          class="inline-block size-6 opacity-50"
        />
        Einstellungen
      </h3>
    </template>

    <template #body>
      <div class="p-4 border-b border-gray-200">
        <USwitch
          v-model="$profile.isPublic"
          :disabled="showLegalDataWarning"
          label="Veröffentlicht"
          :description="$profile.isPublic ? 'Ihre Website ist öffentlich zugänglich.' : 'Nur Sie können Ihr Profil sehen, wenn Sie angemeldet sind.'"
          @update:model-value="togglePublished"
        />
        <UAlert
          v-if="showLegalDataWarning"
          variant="soft"
          title="Rechtliche Angaben fehlen"
          icon="i-heroicons-exclamation-triangle"
          class="mt-2"
          color="error"
        >
          <template #description>
            Bevor Sie Ihre Website veröffentlichen können, müssen Sie unter <strong>Anschrift und Rechtliches</strong> Ihre Unternehmensdaten angeben, damit diese im Impressum und in der Datenschutzerklärung aufgeführt werden.
          </template>
        </UAlert>
      </div>
      <UAccordion
        v-model="active"
        :items="items"
        :unmount-on-hide="false"
        :ui="{
          header: 'px-4 hover:bg-gray-50',
        }"
      >
        <template #trailing="{ item, open }">
          <div class="ml-auto flex items-center gap-2">
            <UBadge
              v-if="item.disabled"
              label="Premium"
              variant="soft"
            />
            <UIcon
              name="i-heroicons-chevron-down"
              class="inline-block size-5 opacity-50"
              :class="{
                'rotate-180': open
              }"
            />
          </div>
        </template>
        <template #company>
          <AdminSettingsModalCompany />
        </template>
        <template #domain>
          <AdminSettingsModalDomain @go-to-subscription="active = '2'" />
        </template>
        <template #email>
          <AdminSettingsModalEmail @go-to-subscription="active = '2'" />
        </template>
        <template #subscription>
          <AdminSettingsModalSubscription />
        </template>
      </UAccordion>
    </template>
  </USlideover>
</template>
