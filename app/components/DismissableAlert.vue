<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    variant?: 'solid' | 'soft'
    title?: string
    icon?: string
    storageKey: string
  }>(),
  {
    variant: 'solid',
    icon: 'i-heroicons-information-circle',
  },
)

const showAlert = useLocalStorage(props.storageKey, true)
</script>

<template>
  <Transition name="fade">
    <UAlert
      v-if="showAlert"
      :variant="variant"
      color="primary"
      :title="title"
      :icon="icon"
      :ui="{ icon: 'size-11', title: 'text-xl' }"
      :close="{ class: 'text-white/75 hover:text-white' }"
      @update:open="showAlert = $event"
    >
      <template #description>
        <slot />
      </template>
    </UAlert>
  </Transition>
</template>
