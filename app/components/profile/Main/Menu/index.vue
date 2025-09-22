<script setup lang="ts">
import type { MenuComponentSchema } from '~~/types/db';

const { component } = defineProps<{
  component: MenuComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()

const { $profile } = useProfile()

const size = computed(() => {
  switch ($profile.settings.public.design.fontSize) {
    case 'lg':
      return 'lg'
    case 'xl':
    case '2xl':
      return 'xl'
    default:
      return 'md'
  }
})

const itemsLeft = computed(() => {
  return component.items.filter(item => item.position === 'left')
})
const itemsCenter = computed(() => {
  return component.items.filter(item => item.position === 'center')
})
const itemsRight = computed(() => {
  return component.items.filter(item => item.position === 'right')
})
</script>

<template>
  <div
    class="w-full relative"
    :id="component.key + '-' + component.id"
    :class="component.key"
  >
    <ProfileMainEditSectionButton
      v-if="$profile.isOwned"
      @click="$emit('edit', component.id)"
    />
    <div class="w-full flex justify-between gap-2 max-w-5xl mx-auto py-4 px-6 transition-all">
      <div class="flex gap-2">
        <ProfileMainMenuButton
          v-for="(item, index) in itemsLeft"
          :key="index"
          :item="item"
          :size="size"
        />
      </div>
      <div class="flex gap-2">
        <ProfileMainMenuButton
          v-for="(item, index) in itemsCenter"
          :key="index"
          :item="item"
          :size="size"
        />
      </div>
      <div class="flex gap-2">
        <ProfileMainMenuButton
          v-for="(item, index) in itemsRight"
          :key="index"
          :item="item"
          :size="size"
        />
      </div>
    </div>
  </div>
</template>
