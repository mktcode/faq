<script setup lang="ts">
import type { MenuComponentSchema } from '~~/types/db';

defineProps<{
  component: MenuComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()

const { $profile } = useProfile()

const size = computed(() => {
  switch ($profile.settings.public.design.fontSize) {
    case 'sm':
      return 'sm'
    case 'lg':
      return 'lg'
    case 'xl':
    case '2xl':
      return 'xl'
    default:
      return 'md'
  }
})
</script>

<template>
  <div class="w-full relative">
    <UButton
      v-if="$profile.isOwned"
      label="Sektion bearbeiten"
      trailing-icon="i-heroicons-pencil"
      variant="soft"
      size="xl"
      class="absolute top-8 -left-44 hover:-left-4 pl-8 transition-all rounded-full z-10"
      @click="$emit('edit', component.id)"
    />
    <div class="w-full flex justify-start gap-2 max-w-5xl mx-auto py-4 px-6 transition-all">
      <UButton
        v-for="(item, index) in component.items"
        :key="index"
        :label="item.title"
        :icon="item.icon"
        :to="item.url"
        :target="item.openInNewTab ? '_blank' : '_self'"
        :variant="item.highlight ? 'solid' : 'ghost'"
        :ui="{
          leadingIcon: 'opacity-50',
        }"
        :size="size"
      />
    </div>
  </div>
</template>
