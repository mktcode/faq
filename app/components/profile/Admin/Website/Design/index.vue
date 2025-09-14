<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const { showWebsiteDesignSettings, go } = useAdmin()
const { $profile } = useProfile()

const isDesktop = useMediaQuery('(min-width: 640px)')
const showCustomCss = ref(false)

watch(
  () => $profile.settings.public.design.color,
  () => {
    const root = document.documentElement
    root.style.setProperty('--ui-color-primary-50', `color-mix(in oklch, white 94%, ${toHslString($profile.settings.public.design.color)} 6%)`)
    root.style.setProperty('--ui-color-primary-100', `color-mix(in oklch, white 88%, ${toHslString($profile.settings.public.design.color)} 12%)`)
    root.style.setProperty('--ui-color-primary-200', `color-mix(in oklch, white 78%, ${toHslString($profile.settings.public.design.color)} 22%)`)
    root.style.setProperty('--ui-color-primary-300', `color-mix(in oklch, white 62%, ${toHslString($profile.settings.public.design.color)} 38%)`)
    root.style.setProperty('--ui-color-primary-400', `color-mix(in oklch, white 46%, ${toHslString($profile.settings.public.design.color)} 54%)`)
    root.style.setProperty('--ui-color-primary-500', toHslString($profile.settings.public.design.color))
    root.style.setProperty('--ui-color-primary-600', `color-mix(in oklch, black 7%, ${toHslString($profile.settings.public.design.color)} 93%`)
    root.style.setProperty('--ui-color-primary-700', `color-mix(in oklch, black 16%, ${toHslString($profile.settings.public.design.color)} 84%`)
    root.style.setProperty('--ui-color-primary-800', `color-mix(in oklch, black 30%, ${toHslString($profile.settings.public.design.color)} 70%`)
    root.style.setProperty('--ui-color-primary-900', `color-mix(in oklch, black 46%, ${toHslString($profile.settings.public.design.color)} 54%`)
    root.style.setProperty('--ui-color-primary-950', `color-mix(in oklch, black 60%, ${toHslString($profile.settings.public.design.color)} 40%`)
  },
  { immediate: true, deep: true },
)
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
        <UFormField
          label="Schriftgröße"
          class="flex-1"
        >
          <USelect
            v-model="$profile.settings.public.design.fontSize"
            class="w-full"
            :items="[
              { label: 'sehr klein', value: 'sm' },
              { label: 'klein', value: 'md' },
              { label: 'mittel', value: 'lg' },
              { label: 'groß', value: 'xl' },
              { label: 'sehr groß', value: '2xl' },
            ]"
          />
        </UFormField>
        <div class="flex gap-2">
          <HslPicker
            v-model:h="$profile.settings.public.design.color.h"
            v-model:s="$profile.settings.public.design.color.s"
            v-model:l="$profile.settings.public.design.color.l"
            label="Primäre Farbe"
          />
          <UFormField
            label="Abrundung"
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
            label="Expertenmodus: Eigenes CSS"
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
