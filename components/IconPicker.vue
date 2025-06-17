<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const icon = defineModel('icon', {
  default: 'i-lucide-information-circle',
  type: String,
})

const items = ref([
  {
    label: 'Backlog',
    value: 'backlog',
    icon: 'i-lucide-circle-help',
  },
  {
    label: 'Todo',
    value: 'todo',
    icon: 'i-lucide-circle-plus',
  },
  {
    label: 'In Progress',
    value: 'in_progress',
    icon: 'i-lucide-circle-arrow-up',
  },
  {
    label: 'Done',
    value: 'done',
    icon: 'i-lucide-circle-check',
  },
] satisfies SelectMenuItem[])

const value = ref(items.value[0])

watch(value, (newValue) => {
  if (newValue) {
    icon.value = newValue.icon
  }
})
</script>

<template>
  <USelectMenu
    v-model="value"
    :items="items"
    :icon="value?.icon"
    variant="soft"
    :ui="{
      base: 'bg-primary-200/50 text-primary-900 w-fit pr-0 hover:bg-primary-100 focus:bg-primary-100 aspect-square',
      content: 'w-fit',
      leadingIcon: 'text-primary-600',
    }"
  >
    <template #default>
      &nbsp;
    </template>
    <template #trailing>
      <span />
    </template>
    <template #item-leading="{ item }">
      <div class="bg-primary-200/50 text-primary-600 hover:bg-primary-100 focus:bg-primary-100 aspect-square flex items-center justify-center p-2 rounded-lg">
        <UIcon
          :name="item.icon"
          class="size-5"
        />
      </div>
    </template>
  </USelectMenu>
</template>
