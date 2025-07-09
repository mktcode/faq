<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const showModal = useState('showSettingsModal', () => false)

const items: AccordionItem[] = [
  {
    label: 'Allgemein',
    icon: 'i-heroicons-paint-brush',
    slot: 'general',
  },
  {
    label: 'Unternehmen',
    icon: 'i-heroicons-building-office-2',
    slot: 'company',
  },
  {
    label: 'Mein Angebot',
    icon: 'i-heroicons-megaphone',
    slot: 'offer',
  },
  {
    label: 'Häufige Fragen',
    icon: 'i-heroicons-question-mark-circle',
    slot: 'faq',
  },
  {
    label: 'Gallerie',
    icon: 'i-heroicons-photo',
    slot: 'gallery',
  },
  {
    label: 'Externe Verlinkungen',
    icon: 'i-heroicons-link',
    slot: 'links',
  },
  {
    label: 'Downloads',
    icon: 'i-heroicons-arrow-down-tray',
    slot: 'downloads',
  },
  {
    label: 'Datenschutz',
    icon: 'i-heroicons-shield-check',
    slot: 'privacy',
  },
  {
    label: 'Gewerbeprofil Plus',
    icon: 'i-heroicons-rocket-launch',
    slot: 'subscription',
  },
]

const active = ref<string | undefined>(undefined)

function switchToSubscription() {
  active.value = '8'
}
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
    :ui="{
      body: '!p-0',
    }"
  >
    <template #body>
      <UAccordion
        v-model="active"
        :items="items"
        :unmount-on-hide="false"
        :ui="{
          header: 'px-4 hover:bg-gray-50',
        }"
      >
        <template #general>
          <SettingsModalGeneral @switch-to-subscription="switchToSubscription" />
        </template>
        <template #company>
          <SettingsModalCompany />
        </template>
        <template #gallery>
          <SettingsModalGallery />
        </template>
        <template #offer>
          <SettingsModalOffer />
        </template>
        <template #links>
          <SettingsModalLinks />
        </template>
        <template #downloads>
          <SettingsModalDownloads />
        </template>
        <template #faq>
          <SettingsModalFAQ />
        </template>
        <template #privacy>
          <SettingsModalPrivacy />
        </template>
        <template #subscription>
          <SettingsModalSubscription />
        </template>
      </UAccordion>
    </template>
  </UModal>
</template>
