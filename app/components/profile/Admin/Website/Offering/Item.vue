<script setup lang="ts">
import type { OfferingComponentSchema } from '~~/types/db';

const offering = defineModel('offering', {
  type: Object as () => OfferingComponentSchema['items'][number],
  required: true,
})

defineEmits<{
  changeOrder: [value: 'up' | 'down']
  remove: [index: number]
}>()

defineProps<{
  index: number
  itemsLength: number
}>()

const isOpen = ref(false)
</script>

<template>
  <UCollapsible
    v-model:open="isOpen"
    class="flex flex-col border-b border-gray-200 bg-white"
    :unmount-on-hide="false"
    :ui="{
      content: 'flex flex-col gap-4 p-4 border-t border-gray-200',
    }"
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
        :disabled="index >= itemsLength - 1"
        class="disabled:text-gray-400"
        @click.stop="$emit('changeOrder', 'down')"
      />
      <UButton
        icon="i-heroicons-trash"
        variant="soft"
        color="error"
        size="xl"
        class="rounded-none"
        @click.stop="$emit('remove', index)"
      />
    </UButtonGroup>

    <template #content>
      <Transition name="fade">
        <img
          v-if="offering.image"
          :src="offering.image"
          alt="Offering Image"
          class="w-full h-48 object-cover rounded-lg"
        />
      </Transition>
      <UButton
        label="Hauptbild festlegen"
        icon="i-heroicons-photo"
        variant="soft"
        @click="offering.image = 'https://picsum.photos/id/136/800/400'"
      />
      <UInput
        v-model="offering.title"
        placeholder="Website erstellen"
        class="w-full"
      />
      <WysiwygEditor
        v-model="offering.description"
        placeholder="Hier kannst du deinen Willkommenstext eingeben..."
        rounded="none"
      />
    </template>
  </UCollapsible>
</template>
