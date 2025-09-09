<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db'

const component = defineModel('component', {
  type: Object as () => HeaderComponentSchema,
  required: true,
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <UFormField
      label="Variante"
    >
      <USelect
        v-model="component.height"
        :items="[
          { label: 'Vollbild', value: 'full' },
          { label: 'halber Bildschirm', value: 'half' },
          { label: 'automatische Höhe', value: 'auto' },
          { label: 'Box', value: 'boxed' },
        ]"
        class="w-full"
      />
    </UFormField>

    <div class="flex gap-2">
      <HslPicker
        v-model:h="component.imageOverlay.color.h"
        v-model:s="component.imageOverlay.color.s"
        v-model:l="component.imageOverlay.color.l"
        label="Hintergrund"
      />
      <UFormField
        label="Deckkraft"
        class="flex-1 pr-1"
      >
        <USlider
          v-model="component.imageOverlay.opacity"
          class="flex-1 mt-4"
        />
      </UFormField>
    </div>
    <div class="flex flex-col gap-4">
      <USwitch
        v-model="component.showShareButton"
        label="Teilen-Button anzeigen"
      />
      <div
        v-for="(link, index) in component.links"
        :key="index"
        class="flex items-start gap-2"
      >
        <IconPicker v-model:icon="link.icon" />
        <div class="flex flex-col gap-2 flex-1">
          <UInput
            v-model="link.title"
            placeholder="Instagram"
            class="flex-1"
          />
          <UInput
            v-model="link.url"
            placeholder="https://..."
            class="flex-1"
          />
        </div>
        <UButton
          icon="i-heroicons-trash"
          variant="ghost"
          color="neutral"
          @click="component.links.splice(index, 1)"
        />
      </div>
      <UButton
        label="Link hinzufügen"
        icon="i-heroicons-plus"
        variant="soft"
        color="neutral"
        @click="component.links.push({ title: '', url: '', icon: 'i-lucide-link' })"
      />
    </div>
  </div>
</template>
