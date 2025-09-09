<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const { showWebsiteDesignSettings, go } = useAdmin()

const isDesktop = useMediaQuery('(min-width: 640px)')
const showCustomCss = ref(false)
</script>

<template>
  <UDrawer
    :open="showWebsiteDesignSettings"
    :direction="isDesktop ? 'left' : 'bottom'"
    close-icon="i-heroicons-arrow-left"
    handle-only
    :overlay="false"
    :close-threshold="0.85"
    :ui="{
      content: 'shadow-2xl shadow-black',
      container: 'relative max-w-md no-scrollbar',
      handle: '!bg-gray-400',
      header: 'h-10',
    }"
    @close="() => go('#website')"
  >
    <template #header>
      <ProfileMainDrawerTip />
      <h3 class="text-lg font-semibold flex gap-2 relative">
        <UIcon
          name="i-heroicons-paint-brush"
          class="inline-block size-6 opacity-50"
        />
        Design
        <div class="flex items-center gap-2 ml-auto">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            size="md"
            @click="go('#website')"
          />
        </div>
      </h3>
    </template>

    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2">
          <HslPicker
            v-model:h="$profile.settings.public.design.color.h"
            v-model:s="$profile.settings.public.design.color.s"
            v-model:l="$profile.settings.public.design.color.l"
            label="Primäre Farbe"
          />
          <UFormField
            label="Stil"
            class="flex-1"
          >
            <USelect
              v-model="$profile.settings.public.design.rounded"
              class="w-full"
              :items="[
                { label: 'Eckig', value: 'none' },
                { label: 'Rund', value: 'md' },
                { label: 'Sehr rund', value: 'xl' },
              ]"
            />
          </UFormField>
        </div>
        <UFormField label="Schriftart">
          <FontPicker v-model:font="$profile.settings.public.design.font" />
        </UFormField>
        <UCollapsible
          v-model:open="showCustomCss"
          class="flex flex-col gap-2"
          :ui="{
            root: 'border border-gray-200 rounded-lg',
            content: '',
          }"
        >
          <UButton
            icon="i-lucide-file-json-2"
            label="Stylesheet bearbeiten"
            color="neutral"
            variant="link"
            trailing-icon="i-heroicons-chevron-down"
            :disabled="!$profile.subscription.plan"
          >
            <template #trailing>
              <div class="ml-auto flex items-center gap-2">
                <UBadge
                  v-if="!$profile.subscription.plan"
                  label="Premium"
                  variant="outline"
                />
                <UIcon
                  v-else
                  name="i-heroicons-chevron-down"
                  class="transition-transform"
                  :class="{ 'rotate-180': showCustomCss }"
                />
              </div>
            </template>
          </UButton>

          <template #content>
            <UTextarea
              v-model="$profile.settings.public.css"
              placeholder="CSS hier eingeben"
              class="w-full"
              autoresize
              :rows="2"
              :maxrows="15"
              :ui="{
                base: 'text-sm rounded-t-none',
              }"
            />
          </template>
        </UCollapsible>
      </div>
    </template>
  </UDrawer>
</template>
