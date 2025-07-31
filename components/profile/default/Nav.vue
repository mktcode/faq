<script setup lang="ts">
const { public: { appHost } } = useRuntimeConfig()
const { isOwned, showLegalDataWarning } = await useProfile()

const { me } = await useMe()

const showSettingsModal = useState('showSettingsModal', () => false)
const showDesignModal = useState('showDesignModal', () => false)
const showContentModal = useState('showContentModal', () => false)
const showMailModal = useState('showMailModal', () => false)
</script>

<template>
  <UPopover
    class="fixed top-2 left-2 z-10"
    :ui="{
      content: 'bg-transparent border-none shadow-none ring-0',
    }"
  >
    <UButton
      icon="i-heroicons-bars-3"
      variant="ghost"
    />

    <template #content>
      <div class="flex flex-col gap-1">
        <UButton
          v-if="me && !isOwned"
          :to="`https://${me.userName}.${appHost}`"
          label="Eigenes Profil"
          icon="i-heroicons-user-circle"
          variant="ghost"
          size="md"
          class="w-full"
        />

        <UButton
          v-if="!me && isOwned"
          :to="`https://${appHost}/login`"
          label="Anmelden"
          icon="i-heroicons-arrow-right-on-rectangle"
          size="md"
          class="w-full"
        />

        <div class="relative">
          <UButton
            v-if="me && isOwned"
            label="Einstellungen"
            icon="i-heroicons-cog-6-tooth"
            size="md"
            class="w-full"
            @click="showSettingsModal = true"
          />
          <div
            v-if="showLegalDataWarning"
            class="bg-red-500 text-white absolute -right-1 -top-1 rounded-full text-sm flex items-center justify-center size-4"
          >
            <UIcon
              name="i-humbleicons-exclamation"
              class="size-3"
            />
          </div>
        </div>

        <UButton
          v-if="me && isOwned"
          label="Design anpassen"
          icon="i-heroicons-paint-brush"
          size="md"
          @click="showDesignModal = true"
        />

        <UButton
          v-if="me && isOwned"
          label="Inhalt und Funktion"
          icon="i-lucide-letter-text"
          size="md"
          @click="showContentModal = true"
        />

        <UButton
          v-if="me && isOwned"
          label="Anfragen"
          icon="i-heroicons-envelope"
          size="md"
          class="w-full"
          @click="showMailModal = true"
        />
      </div>
    </template>
  </UPopover>
</template>
