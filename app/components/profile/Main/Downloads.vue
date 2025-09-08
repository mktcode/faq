<script setup lang="ts">
import type { DownloadsComponentSchema } from '~~/types/db';

const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

defineProps<{
  component: DownloadsComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()
</script>

<template>
  <div class="w-full relative">
    <UButton
      v-if="$profile.isOwned"
      label="Sektion bearbeiten"
      trailing-icon="i-heroicons-pencil-square"
      variant="outline"
      size="xl"
      class="absolute top-4 -left-44 hover:-left-4 pl-5 transition-all rounded-full z-10"
      @click="$emit('edit', component.id)"
    />
    
    <div class="max-w-5xl mx-auto py-24 px-6">
      <ProfileMainComponentHeader :component="component" />
      <div
        v-if="component.items.length"
        class="w-full flex flex-col gap-2"
      >
        <div
          v-for="download in component.items"
          :key="download.url"
          class="p-4 border border-gray-200"
          :class="{
            'rounded-none': $profile.settings.public.design.rounded === 'none',
            'rounded-md': $profile.settings.public.design.rounded === 'md',
            'rounded-xl': $profile.settings.public.design.rounded === 'xl',
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
  </div>
</template>
