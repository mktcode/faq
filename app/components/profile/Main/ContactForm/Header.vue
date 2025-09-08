<script setup lang="ts">
import type { FormComponentSchema } from '~~/types/db';

defineProps<{
  component: FormComponentSchema;
}>()
</script>

<template>
  <div class="mb-8">
    <a
      id="anfrage"
      href="#anfrage"
      class="block text-2xl font-semibold cursor-pointer relative before:content-['#'] before:absolute before:-left-6 before:text-gray-200 before:opacity-0 before:transition-opacity hover:before:opacity-100"
    >
      {{ component.title || 'Anfrage' }}
    </a>

    <p class="text-gray-500 mt-3">
      {{ component.description || 'Beschreiben Sie Ihr Anliegen. Wir melden uns zeitnah bei Ihnen.' }}
    </p>

    <div class="flex flex-col gap-3 mt-6 leading-none">
      <div class="flex gap-2">
        <UIcon
          name="i-heroicons-building-office-2"
          class="size-5 opacity-50 text-primary-900/60"
        />
        <span class="text-gray-500">
          {{ $profile.settings.public.company.name }}
        </span>
      </div>
  
      <div
        v-if="$profile.settings.public.company.street && $profile.settings.public.company.zip && $profile.settings.public.company.city"
        class="flex gap-2"
      >
        <UIcon
          name="i-heroicons-map-pin"
          class="size-5 opacity-50 text-primary-900/60 mt-1"
        />
        <span class="text-gray-500 leading-snug">
          {{ $profile.settings.public.company.street }}<br />
          {{ $profile.settings.public.company.zip }} {{ $profile.settings.public.company.city }}
        </span>
      </div>
  
      <div
        v-if="$profile.settings.public.company.phone"
        class="flex items-center gap-2"
      >
        <UIcon
          name="i-heroicons-phone"
          class="size-5 opacity-50 text-primary-900/60"
        />
        <span class="text-gray-500">
          {{ $profile.settings.public.company.phone }}
        </span>
      </div>

      <div
        v-if="$profile.settings.public.company.email"
        class="flex items-center gap-2"
      >
        <UIcon
          name="i-heroicons-envelope"
          class="size-5 opacity-50 text-primary-900/60"
        />
        <span class="text-gray-500">
          {{ $profile.settings.public.company.email }}
        </span>
      </div>
    </div>
  </div>
</template>
