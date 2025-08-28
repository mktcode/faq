<script setup lang="ts">
const offering = defineModel('offering', {
  type: Object as () => { title: string; description: string },
  required: true,
})

defineEmits<{
  (e: 'changeOrder', value: 'up' | 'down'): void
}>()

defineProps<{
  index: number
}>()

const isOpen = ref(false)
</script>

<template>
  <UCollapsible
    class="flex flex-col border border-gray-200 rounded-lg bg-white"
    :unmount-on-hide="false"
    v-model:open="isOpen"
  >
    <UButtonGroup>
      <UButton
        :label="offering.title || 'Neues Angebot'"
        variant="ghost"
        color="neutral"
        size="xxl"
        class="truncate flex-1 rounded-none"
      />
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-up"
        size="xxl"
        @click.stop="$emit('changeOrder', 'up')"
        :disabled="index === 0"
        class="disabled:text-gray-400"
      />
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-down"
        size="xxl"
        @click.stop="$emit('changeOrder', 'down')"
        :disabled="index >= $profile.settings.public.components.offers.items.length - 1"
        class="disabled:text-gray-400"
      />
      <UButton
        icon="i-heroicons-trash"
        variant="soft"
        color="error"
        size="xxl"
        @click.stop="$profile.settings.public.components.offers.items.splice(index, 1)"
        class="rounded-none"
      />
    </UButtonGroup>
    
    <template #content>
      <UInput
        v-model="offering.title"
        placeholder="Website erstellen"
        class="w-full"
        :ui="{ base: 'rounded-none' }"
      />
      <WysiwygEditor
        v-model="offering.description"
        placeholder="Hier kannst du deinen Willkommenstext eingeben..."
        rounded="none"
      />
    </template>
  </UCollapsible>
</template>
