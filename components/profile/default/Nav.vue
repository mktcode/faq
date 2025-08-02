<script setup lang="ts">
const { showLegalDataWarning } = await useProfile()

const showSettingsModal = useState('showSettingsModal', () => false)
const showDesignModal = useState('showDesignModal', () => false)
const showContentModal = useState('showContentModal', () => false)
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
      class="bg-white"
      label="Menü"
    />

    <template #content>
      <div class="flex flex-col gap-1">
        <div class="relative">
          <UButton
            label="Einstellungen"
            icon="i-heroicons-cog-6-tooth"
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
          label="Design anpassen"
          icon="i-heroicons-paint-brush"
          @click="showDesignModal = true"
        />

        <UButton
          label="Inhalt und Funktion"
          icon="i-lucide-letter-text"
          @click="showContentModal = true"
        />
      </div>
    </template>
  </UPopover>
</template>
