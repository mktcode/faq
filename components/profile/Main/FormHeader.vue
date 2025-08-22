<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp
</script>

<template>
  <div class="mb-8">
    <a
      id="anfrage"
      href="#anfrage"
      class="block pt-12 text-2xl font-semibold cursor-pointer relative before:content-['#'] before:absolute before:-left-6 before:text-gray-200 before:opacity-0 before:transition-opacity hover:before:opacity-100"
    >
      {{ $profile.settings.components.form.title || 'Anfrage' }}
    </a>

    <p class="text-gray-500 mt-3">
      {{ $profile.settings.components.form.description || 'Beschreiben Sie Ihr Anliegen. Wir melden uns zeitnah bei Ihnen.' }}
    </p>

    <div
      v-if="$profile.settings.company.phone"
      class="flex text-xl items-center gap-1 mt-4"
    >
      <UIcon
        name="i-heroicons-phone"
      />
      <span class="text-gray-500 ml-2">
        {{ $profile.settings.company.phone }}
      </span>
    </div>
  </div>
</template>
