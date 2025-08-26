<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

const showDrawerTip = useLocalStorage('showDrawerTip', true);
</script>

<template>
  <ClientOnly>
    <Transition name="fade">
      <div
        v-if="showDrawerTip"
        class="absolute inset-0 bg-white/90 z-10 flex justify-end items-center"
      >
        <div class="p-4 m-4 text-center text-sm text-gray-500 shadow-md bg-white rounded-lg max-w-sm h-min">
          <div>
            Ziehen Sie das Panel an dem grauen Balken nach links, um Ihre Änderungen zu sehen.
          </div>
          <UButton
            label="Alles klar!"
            icon="i-heroicons-check"
            class="mt-4"
            @click="showDrawerTip = false"
          />
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>