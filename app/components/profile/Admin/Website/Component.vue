<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const { page, component, go } = useAdmin()

const isDesktop = useMediaQuery('(min-width: 640px)')
</script>

<template>
  <UDrawer
    v-if="page && component"
    :open="!!component"
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
  >
    <template #header>
      <h3 class="text-lg font-semibold flex gap-2 relative">
        <UIcon
          name="i-heroicons-paint-brush"
          class="inline-block size-6 opacity-50"
        />
        {{ component.title }}
        <div class="flex items-center gap-2 ml-auto">
          <ProfileAdminSaveAndReset />
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            size="md"
            @click="go(`#website/page/${page.id}`)"
          />
        </div>
      </h3>
    </template>

    <template #body>
      <ProfileAdminWebsiteOffering
        v-if="component.key === 'offerings'"
        v-model:component="component"
      />
    </template>
  </UDrawer>
</template>
