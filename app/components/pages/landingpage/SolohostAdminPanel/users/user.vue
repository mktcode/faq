<script setup lang="ts">
import type { User } from '~~/types/db';

defineProps<{
  user: Omit<User, 'lastPaidAt' | 'oneTimePasswordCreatedAt' | 'createdAt'> & { lastPaidAt: string | null, oneTimePasswordCreatedAt: string | null, createdAt: string }
  expanded: boolean
}>()

const emit = defineEmits<{
  expand: [void]
  collapse: [void]
}>()

function toggle(isOpen: boolean) {
  if (isOpen) {
    emit('expand')
  } else {
    emit('collapse')
  }
}
</script>

<template>
  <UCollapsible
    :open="expanded"
    @update:open="toggle"
  >
    <UButton
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      block
      class="rounded-none"
    >
      <template #default>
        <div
          class="size-10 rounded flex items-center justify-center"
          :class="{
            'bg-gray-200 text-xs text-gray-400': user.plan === null,
            'bg-sky-500 text-sky-100': user.plan === 'S',
            'bg-indigo-500 text-indigo-100': user.plan === 'L',
          }"
        >
          {{ user.plan || 'free' }}
        </div>
        <div class="flex flex-col text-left">
          <div>
            {{ user.userName }}
          </div>
          <div class="text-sm text-gray-500 font-normal">
            {{ user.email }}
          </div>
        </div>
      </template>
    </UButton>

    <template #content>
      <div class="flex flex-col gap-2 p-2">
        <div class="text-sm">ID: {{ user.id }}</div>
        <div class="text-sm">E-Mail: {{ user.email }}</div>
        <div class="text-sm">Erstellt: {{ new Date(user.createdAt).toLocaleDateString() }}</div>
      </div>
    </template>
  </UCollapsible>
</template>