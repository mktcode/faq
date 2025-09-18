<script setup lang="ts">
const icon = defineModel('icon', {
  default: undefined,
  type: String as () => string | undefined,
})

const items = ref([
  {
    label: 'Kein Symbol',
    icon: undefined,
  },
  {
    label: 'Haus',
    icon: 'i-lucide-home',
    searchTerms: ['start', 'home'],
  },
  {
    label: 'Haus 2',
    icon: 'i-heroicons-home',
    searchTerms: ['start', 'home'],
  },
  {
    label: 'Megafon',
    icon: 'i-heroicons-megaphone',
    searchTerms: ['lautsprecher', 'ankündigung', 'marketing', 'news'],
  },
  {
    label: 'Brief',
    icon: 'i-lucide-mail',
    searchTerms: ['email', 'kontakt', 'umschlag'],
  },
  {
    label: 'Instagram',
    icon: 'i-lucide-instagram',
    searchTerms: ['social'],
  },
  {
    label: 'Facebook',
    icon: 'i-lucide-facebook',
    searchTerms: ['social'],
  },
  {
    label: 'Twitter',
    icon: 'i-lucide-twitter',
    searchTerms: ['social'],
  },
  {
    label: 'LinkedIn',
    icon: 'i-lucide-linkedin',
    searchTerms: ['social'],
  },
  {
    label: 'GitHub',
    icon: 'i-lucide-github',
    searchTerms: ['social'],
  },
  {
    label: 'YouTube',
    icon: 'i-lucide-youtube',
    searchTerms: ['video', 'social'],
  },
  {
    label: 'TikTok',
    icon: 'i-fa-brands-tiktok',
    searchTerms: ['video', 'social'],
  },
  {
    label: 'Pinterest',
    icon: 'i-fa-brands-pinterest',
    searchTerms: ['social'],
  },
  {
    label: 'Kleinanzeigen',
    icon: 'i-simple-icons-kleinanzeigen',
    searchTerms: ['anzeigen', 'markt', 'auktion', 'verkaufen', 'shop'],
  },
  {
    label: 'Ebay',
    icon: 'i-fa-brands-ebay',
    searchTerms: ['auktion', 'verkaufen'],
  },
  {
    label: 'Etsy',
    icon: 'i-fa-brands-etsy',
    searchTerms: ['handgemacht', 'kunsthandwerk', 'shop'],
  },
  {
    label: 'Avocado',
    icon: 'i-icon-park-solid-avocado',
    searchTerms: ['essen', 'lebensmittel', 'gesund'],
  },
  {
    label: 'Google',
    icon: 'i-fa-brands-google',
    searchTerms: ['suche', 'browser'],
  },
  {
    label: 'Discord',
    icon: 'i-fa-brands-discord',
    searchTerms: ['chat', 'kommunikation'],
  },
  {
    label: 'Bluesky',
    icon: 'i-simple-icons-bluesky',
    searchTerms: ['social'],
  },
  {
    label: 'Mastodon',
    icon: 'i-fa-brands-mastodon',
    searchTerms: ['social'],
  },
  {
    label: 'Shop',
    icon: 'i-lucide-shopping-cart',
    searchTerms: ['einkaufen', 'warenkorb', 'laden'],
  },
  {
    label: 'Website',
    icon: 'i-lucide-globe',
    searchTerms: ['internet', 'web', 'www'],
  },
  {
    label: 'Link',
    icon: 'i-lucide-link',
    searchTerms: ['url', 'verknüpfung', 'web'],
  },
  {
    label: 'Rakete',
    icon: 'i-lucide-rocket',
    searchTerms: ['start', 'neu', 'launch'],
  },
])

const filterInput = ref('')
const filteredItems = computed(() => {
  if (!filterInput.value) {
    return items.value
  }
  return items.value.filter(item =>
    item.label.toLowerCase().includes(filterInput.value.toLowerCase())
    || (item.searchTerms && item.searchTerms.some(term => term.toLowerCase().includes(filterInput.value.toLowerCase())))
  )
})

const open = ref(false)

function selectIcon(item: { icon: string | undefined }) {
  icon.value = item.icon as string | undefined
  open.value = false
}
</script>

<template>
  <UButton
    variant="soft"
    :icon="icon || 'i-lucide-circle-off'"
    @click="open = true"
  />
  <UModal
    v-model:open="open"
    title="Symbol auswählen"
  >
    <template #body>
      <UButton
        label="Eigenes Symbol hochladen"
        icon="i-lucide-upload"
        variant="soft"
        class="mb-4 w-full"
      />
      <UInput
        v-model="filterInput"
        placeholder="Symbole filtern..."
        class="mb-4 w-full"
        clearable
        icon="i-lucide-search"
      >
        <template v-if="filterInput" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-x"
            aria-label="Eingabe löschen"
            @click="filterInput = ''"
          />
        </template>
      </UInput>
      <div class="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
        <button
          v-for="item in filteredItems"
          :key="item.icon"
          @click="selectIcon(item)"
          class="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-primary-100 focus:bg-primary-100"
        >
          <div
            class="text-primary-600 aspect-square flex items-center justify-center p-2 rounded-lg"
          >
            <UIcon
              :name="item.icon || 'i-lucide-circle-off'"
              class="size-8"
              :class="{ 'opacity-50 text-gray-300': !item.icon }"
            />
          </div>
          <span class="text-sm text-center">{{ item.label }}</span>
        </button>
      </div>
    </template>
  </UModal>
</template>
