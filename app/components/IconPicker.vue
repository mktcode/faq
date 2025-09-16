<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const icon = defineModel('icon', {
  default: 'none',
  type: String,
})

// TODO: Add more icons
const items = ref([
  {
    label: 'Kein Symbol',
    value: 'none',
  },
  {
    label: 'Haus',
    value: 'i-lucide-home',
    icon: 'i-lucide-home',
  },
  {
    label: 'Haus 2',
    value: 'i-heroicons-home',
    icon: 'i-heroicons-home',
  },
  {
    label: 'Megafon',
    value: 'i-heroicons-megaphone',
    icon: 'i-heroicons-megaphone',
  },
  {
    label: 'Brief',
    value: 'i-lucide-mail',
    icon: 'i-lucide-mail',
  },
  {
    label: 'Instagram',
    value: 'i-lucide-instagram',
    icon: 'i-lucide-instagram',
  },
  {
    label: 'Facebook',
    value: 'i-lucide-facebook',
    icon: 'i-lucide-facebook',
  },
  {
    label: 'Twitter',
    value: 'i-lucide-twitter',
    icon: 'i-lucide-twitter',
  },
  {
    label: 'LinkedIn',
    value: 'i-lucide-linkedin',
    icon: 'i-lucide-linkedin',
  },
  {
    label: 'GitHub',
    value: 'i-lucide-github',
    icon: 'i-lucide-github',
  },
  {
    label: 'YouTube',
    value: 'i-lucide-youtube',
    icon: 'i-lucide-youtube',
  },
  {
    label: 'TikTok',
    value: 'i-fa-brands-tiktok',
    icon: 'i-fa-brands-tiktok',
  },
  {
    label: 'Pinterest',
    value: 'i-fa-brands-pinterest',
    icon: 'i-fa-brands-pinterest',
  },
  {
    label: 'Kleinanzeigen',
    value: 'i-simple-icons-kleinanzeigen',
    icon: 'i-simple-icons-kleinanzeigen',
  },
  {
    label: 'Ebay',
    value: 'i-fa-brands-ebay',
    icon: 'i-fa-brands-ebay',
  },
  {
    label: 'Etsy',
    value: 'i-fa-brands-etsy',
    icon: 'i-fa-brands-etsy',
  },
  {
    label: 'Avocado',
    value: 'i-icon-park-solid-avocado',
    icon: 'i-icon-park-solid-avocado',
  },
  {
    label: 'Google',
    value: 'i-fa-brands-google',
    icon: 'i-fa-brands-google',
  },
  {
    label: 'Discord',
    value: 'i-fa-brands-discord',
    icon: 'i-fa-brands-discord',
  },
  {
    label: 'Bluesky',
    value: 'i-simple-icons-bluesky',
    icon: 'i-simple-icons-bluesky',
  },
  {
    label: 'Mastodon',
    value: 'i-fa-brands-mastodon',
    icon: 'i-fa-brands-mastodon',
  },
  {
    label: 'Shop',
    value: 'i-lucide-shopping-cart',
    icon: 'i-lucide-shopping-cart',
  },
  {
    label: 'Website',
    value: 'i-lucide-globe',
    icon: 'i-lucide-globe',
  },
  {
    label: 'Link',
    value: 'i-lucide-link',
    icon: 'i-lucide-link',
  },
  {
    label: 'Rakete',
    value: 'i-lucide-rocket',
    icon: 'i-lucide-rocket',
  },
] satisfies SelectMenuItem[])

const value = ref(icon.value ? items.value.find(item => item.value === icon.value) : items.value[0])

watch(value, (newValue) => {
  if (newValue) {
    icon.value = newValue.icon || 'none'
  }
}, { immediate: true })
</script>

<template>
  <USelectMenu
    v-model="value"
    :items="items"
    :icon="value?.icon"
    variant="soft"
    :ui="{
      base: 'bg-primary-200/50 text-primary-900 w-fit pr-0 hover:bg-primary-100 focus:bg-primary-100 aspect-square size-10',
      content: 'w-fit',
      leadingIcon: 'text-primary-600 size-5',
    }"
  >
    <template #default>
      &nbsp;
    </template>
    <template #trailing>
      <span />
    </template>
    <template #item-leading="{ item }">
      <div
        v-if="item.icon"
        class="bg-primary-200/50 text-primary-600 hover:bg-primary-100 focus:bg-primary-100 aspect-square flex items-center justify-center p-2 rounded-lg"
      >
        <UIcon
          :name="item.icon"
          class="size-5"
        />
      </div>
    </template>
  </USelectMenu>
</template>
