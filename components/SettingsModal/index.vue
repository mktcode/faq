<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

defineEmits(['update'])

const toast = useToast()
const showModal = useState('showSettingsModal', () => false)
const { me } = await useMe()
const { showLegalDataWarning } = await useProfile()

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
    label: 'Domain und E-Mail',
    icon: 'i-heroicons-globe-alt',
    slot: 'domain',
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
  <UModal
    v-model:open="showModal"
    :ui="{
      body: '!p-0',
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
          v-model="isPublished"
          :disabled="showLegalDataWarning"
          label="Veröffentlicht"
          :description="isPublished ? 'Ihre Website ist öffentlich zugänglich.' : 'Nur Sie können Ihr Profil sehen, wenn Sie angemeldet sind.'"
          @update:model-value="togglePublished"
        />
        <UAlert
          v-if="showLegalDataWarning"
          variant="soft"
          title="Rechtliche Angaben fehlen"
          description="Bevor Sie Ihr Profil veröffentlichen können, müssen Sie unter Anschrift und Rechtliches Ihre Unternehmensdaten angeben, damit diese im Impressum und in der Datenschutzerklärung aufgeführt werden."
          icon="i-heroicons-exclamation-triangle"
          class="mt-2"
        />
      </div>
      <UAccordion
        v-model="active"
        :items="items"
        :unmount-on-hide="false"
        :ui="{
          header: 'px-4 hover:bg-gray-50',
        }"
      >
        <template #company>
          <SettingsModalCompany />
        </template>
        <template #domain>
          <SettingsModalDomain @go-to-subscription="active = '2'" />
        </template>
        <template #subscription>
          <SettingsModalSubscription />
        </template>
      </UAccordion>
    </template>
  </UModal>
</template>
