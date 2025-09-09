<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>

<template>
  <div
    class="@container w-full flex flex-col items-center justify-center gap-2 max-w-xl mx-auto py-24 px-6 relative z-10"
  >
    <div
      v-if="$profile.settings.public.company.logo"
    >
      <a href="/">
        <NuxtImg
          :src="$profile.settings.public.company.logo"
          alt="Logo"
          class="w-32 mb-4"
        />
      </a>
    </div>
    <a href="/">
      <h1
        class="text-center text-shadow-lg font-bold mb-4 leading-none opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.5s_forwards]"
        :style="{
          'color': toHslString(component.titleColor),
          'font-size': (component.titleFontSize || '10') + 'cqw',
        }"
      >
        {{ component.title }}
      </h1>
    </a>
    <div
      v-if="component.description"
      class="text-center leading-snug text-shadow-md mb-4 opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.8s_forwards]"
      :style="{
        'color': toHslString(component.descriptionColor),
        'font-size': (component.descriptionFontSize || '6') + 'cqw',
      }"
      v-html="component.description"
    />
    <ProfileMainHeaderLinks :component="component" />
  </div>
</template>
