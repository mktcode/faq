<script setup lang="ts">
defineProps<{
  username: string
  links: {
    title: string
    url: string
    icon: string
  }[]
}>()

const { public: { appHost } } = useRuntimeConfig()
const showModal = useState('showLinksModal', () => false)
</script>

<template>
  <div class="w-full flex items-center justify-center gap-2 mb-4">
    <UButton
      v-for="(link, index) in links"
      :key="index"
      :label="link.title"
      :icon="link.icon === 'none' ? undefined : link.icon"
      :href="link.url"
      target="_blank"
    />

    <UPopover class="mb-auto">
      <UButton
        label="Teilen"
        icon="i-heroicons-share"
      />

      <template #content>
        <div class="m-4 inline-flex flex-col gap-4 max-w-xl">
          <div class="text-gray-500">
            {{ `${username}.${appHost}` }}
          </div>
          <div class="flex flex-col gap-2">
            <UButton
              target="_blank"
              label="Link kopieren"
              icon="i-heroicons-link"
              variant="soft"
            />
            <UButton
              label="Auf Facebook teilen"
              icon="i-lucide-facebook"
              variant="soft"
            />
            <UButton
              label="Auf Instagram teilen"
              icon="i-lucide-instagram"
              variant="soft"
            />
            <UButton
              label="per E-Mail teilen"
              icon="i-heroicons-envelope"
              variant="soft"
            />
            <UButton
              label="Auf WhatsApp teilen"
              icon="i-ic-baseline-whatsapp"
              variant="soft"
              target="_blank"
              :to="`https://wa.me/?text=${encodeURIComponent(`Schau dir mein Gewerbeprofil an: https://${username}.${appHost}`)}`"
            />
          </div>
        </div>
      </template>
    </UPopover>

    <UButton
      icon="i-lucide-ellipsis"
      @click="showModal = true"
    />
  </div>
</template>
