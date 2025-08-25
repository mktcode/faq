<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const showModal = useState('showSettingsModal', () => false)

const { $profile } = useProfile()

const items: AccordionItem[] = [
  {
    label: 'Unternehmensdaten',
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
    disabled: !$profile.isSubscribed,
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
                'rotate-180': open,
              }"
            />
          </div>
        </template>
        <template #company>
          <ProfileAdminSettingsModalCompany />
        </template>
        <template #domain>
          <ProfileAdminSettingsModalDomain @go-to-subscription="active = '3'" />
        </template>
        <template #email>
          <ProfileAdminSettingsModalEmail />
        </template>
        <template #subscription>
          <ProfileAdminSettingsModalSubscription />
        </template>
      </UAccordion>
    </template>
  </USlideover>
</template>
