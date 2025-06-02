<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout name="default">
    <div class="flex flex-col items-center justify-center h-screen gap-4">
      <h2 class="text-2xl text-center">
        Ups! Ein Fehler ist aufgetreten: {{ error?.message }}
      </h2>
      <button
        class="button mt-4"
        @click="handleError"
      >
        Zurück zur Startseite
      </button>
    </div>
  </NuxtLayout>
</template>
