<script setup lang="ts">
const offering = defineModel('offering', {
  type: Object as () => { title: string, description: string },
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
    v-model:open="isOpen"
    class="flex flex-col border border-gray-200 rounded-lg bg-white"
    :unmount-on-hide="false"
  >
    <UButtonGroup>
      <UButton
        :label="offering.title || 'Neues Angebot'"
        variant="ghost"
        color="neutral"
        size="xl"
        class="truncate flex-1 rounded-none"
      />
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-up"
        size="xl"
        :disabled="index === 0"
        class="disabled:text-gray-400"
        @click.stop="$emit('changeOrder', 'up')"
      />
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-down"
        size="xl"
        :disabled="index >= $profile.settings.public.components.offers.items.length - 1"
        class="disabled:text-gray-400"
        @click.stop="$emit('changeOrder', 'down')"
      />
      <UButton
        icon="i-heroicons-trash"
        variant="soft"
        color="error"
        size="xl"
        class="rounded-none"
        @click.stop="$profile.settings.public.components.offers.items.splice(index, 1)"
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
