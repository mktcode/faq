<script setup lang="ts">
import type { MenuComponentSchema } from '~~/types/db';

const { item, size } = defineProps<{
  item: MenuComponentSchema['items'][number];
  size: 'sm' | 'md' | 'lg' | 'xl';
}>()

const iconIsImage = computed(() => {
  return item.icon ? item.icon.startsWith('http') : false
})
</script>

<template>
  <UButton
    :icon="iconIsImage ? undefined : item.icon"
    :to="item.url"
    :target="item.openInNewTab ? '_blank' : '_self'"
    :variant="item.highlight ? 'solid' : 'ghost'"
    :ui="{
      leadingIcon: 'opacity-50',
    }"
    :size="size"
  >
    <template #default>
      <img
        v-if="iconIsImage"
        :src="item.icon"
        alt="Eigenes Symbol"
        class="size-10 object-contain rounded"
      />
      <div class="flex flex-col items-start">
        <span class="leading-tight">{{ item.title }}</span>
        <span v-if="item.subtitle" class="text-[80%] opacity-70">{{ item.subtitle }}</span>
      </div>
    </template>
  </UButton>
</template>
