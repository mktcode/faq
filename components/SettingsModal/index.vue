<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

defineEmits(['update'])

const toast = useToast()
const showModal = useState('showSettingsModal', () => false)
const { me } = await useMe()

const isPublished = ref(me.value?.published || false)

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
    label: 'Angebot',
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
    label: 'Gewerbeprofil Plus',
    icon: 'i-heroicons-rocket-launch',
    slot: 'subscription',
  },
]
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
      <div class="p-4 border-b border-gray-200">
        <USwitch
          v-model="isPublished"
          label="Veröffentlicht"
          :description="isPublished ? 'Dein Profil ist öffentlich zugänglich.' : 'Dein Profil ist privat.'"
          @update:model-value="togglePublished"
        />
      </div>
      <UAccordion
        :items="items"
        :unmount-on-hide="false"
        :ui="{
          header: 'px-4 hover:bg-gray-50',
        }"
      >
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
        <template #subscription>
          <SettingsModalSubscription />
        </template>
      </UAccordion>
    </template>
  </UModal>
</template>
