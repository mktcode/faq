<script setup lang="ts">
const { me } = await useMe()
const { username, isOwned, settings } = await useProfile()

const { public: { appHost } } = useRuntimeConfig()
const showModal = useState('showLinksModal', () => false)
</script>

<template>
  <div class="w-full flex items-center justify-center gap-2 mb-4">
    <template v-if="settings?.links && settings.links.length > 0">
      <UButton
        v-for="(link, index) in settings.links"
        :key="index"
        :label="link.title"
        :icon="link.icon === 'none' ? undefined : link.icon"
        :href="link.url"
        target="_blank"
      />
    </template>

    <UPopover
      v-if="settings?.showShareButton"
      class="mb-auto"
    >
      <UButton
        label="Teilen"
        icon="i-heroicons-share"
      />

      <template #content>
        <div class="m-4 inline-flex flex-col gap-4 max-w-xl">
          <template v-if="me && !me.published && isOwned">
            <UAlert class="max-w-sm">
              <template #description>
                Dein Profil ist noch nicht veröffentlicht. Das kannst du in den Einstellungen
                <UIcon
                  name="i-heroicons-cog-6-tooth"
                  class="inline-block size-5 align-middle"
                />
                ändern.
              </template>
            </UAlert>
          </template>
          <div class="text-gray-500 text-xl border border-gray-200 rounded-lg p-2 pl-4 flex items-center justify-between">
            <span>
              {{ `${username}.${appHost}` }}
            </span>
            <UButton
              class="ml-2"
              icon="i-heroicons-clipboard"
              variant="soft"
            />
          </div>
          <div class="flex flex-col gap-2">
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
              :to="`https://wa.me/?text=${encodeURIComponent(`Meine Website: https://${username}.${appHost}`)}`"
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
