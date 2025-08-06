<script setup lang="ts">
import { defaultSettings } from '~/types/db';

const { settings } = await useProfile()

const designRounded = ref(settings.value?.design.rounded || defaultSettings.design.rounded)
</script>

<template>
  <div
    v-if="settings?.components.downloads.items.length"
    class="my-6 w-full"
  >
    <div class="flex flex-col gap-2">
      <div
        v-for="download in settings.components.downloads.items"
        :key="download.url"
        class="p-4 border border-gray-200"
        :class="{
          'rounded-none': designRounded === 'none',
          'rounded-md': designRounded === 'md',
          'rounded-xl': designRounded === 'xl',
        }"
      >
        <h4 class="text-lg font-semibold">
          {{ download.title }}
        </h4>
        <p
          v-if="download.description"
          class="text-gray-500 text-sm"
        >
          {{ download.description }}
        </p>
        <div class="mt-4 flex items-center gap-4">
          <UButton
            label="Herunterladen"
            :href="download.url"
            target="_blank"
            size="md"
            icon="i-heroicons-arrow-down-tray"
          />
          <div class="flex items-center gap-1 text-gray-400 text-sm">
            <template v-if="download.type === 'pdf'">
              <UIcon
                :name="download.type === 'pdf' ? 'i-lucide-file-text' : 'i-heroicons-photo'"
                size="20"
                class="text-gray-300"
              />
              PDF
            </template>
            <template v-else-if="download.type === 'image'">
              <UIcon
                name="i-heroicons-photo"
                size="20"
                class="text-gray-300"
              />
              Bild
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
