<script setup lang="ts">
import type { MenuComponentSchema } from '~~/types/db';

const {} = defineProps<{
  item: MenuComponentSchema['items'][number];
  size: 'sm' | 'md' | 'lg' | 'xl';
}>()
</script>

<template>
  <UButton
    :icon="item.icon"
    :to="item.url"
    :target="item.openInNewTab ? '_blank' : '_self'"
    :variant="item.highlight ? 'solid' : 'ghost'"
    :ui="{
      leadingIcon: 'opacity-50',
    }"
    :size="size"
  >
    <template #default>
      <div class="flex flex-col items-start">
        <span class="leading-tight">{{ item.title }}</span>
        <span v-if="item.subtitle" class="text-[80%] opacity-70">{{ item.subtitle }}</span>
      </div>
    </template>
  </UButton>
</template>
