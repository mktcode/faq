<script setup lang="ts">
import type { MenuComponentSchema } from '~~/types/db';

const { $profile } = useProfile()

const item = defineModel('item', {
  type: Object as () => MenuComponentSchema['items'][number],
  required: true,
})

defineEmits<{
  delete: []
}>()

const open = ref(false)
const targetType = ref<'internal' | 'external'>(item.value.url.startsWith('http') ? 'external' : 'internal')

const internalTargets = computed<{ label: string; value: string }[]>(() => {
  const targets: { label: string; value: string }[] = []
  
  for (const page of $profile.settings.public.pages) {
    targets.push({ label: page.title, value: page.path })
    for (const component of page.components) {
      targets.push({ label: `${page.title} » ${component.title}`, value: `${page.path}#${component.key}` })
    }
  }

  return targets
})

watch(targetType, (newValue) => {
  if (newValue === 'internal') {
    item.value.openInNewTab = false
  } else if (newValue === 'external') {
    item.value.openInNewTab = true
  }
})
</script>

<template>
  <UCollapsible
    v-model:open="open"
    class="flex flex-col gap-2"
    :ui="{
      root: 'border-b border-gray-200 !gap-0',
      content: 'flex flex-col gap-4 p-4 border-t border-gray-200',
    }"
  >
    <template #default>
      <div class="flex items-center">
        <UButton
          :label="`${item.title}`"
          class="w-full rounded-none p-4"
          variant="ghost"
          color="neutral"
          trailing-icon="i-heroicons-chevron-down"
          :ui="{
            trailingIcon: `ml-auto transition-transform ${open ? 'rotate-180' : ''}`,
          }"
        />
      </div>
    </template>

    <template #content>
      <div class="flex gap-2">
        <UFormField
          label="Symbol"
        >
          <IconPicker v-model:icon="item.icon" />
        </UFormField>
        <UFormField
          label="Beschriftung"
          :ui="{ container: 'flex gap-2' }"
        >
          <UInput
            v-model="item.title"
            size="xl"
            class="w-full"
          />
          <UButton
            icon="i-heroicons-trash"
            variant="soft"
            color="error"
            size="md"
            @click="$emit('delete')"
          />
        </UFormField>
      </div>
      <UFormField
        label="Ausrichtung"
      >
        <USelect
          v-model="item.position"
          :items="[
            { label: 'Links', value: 'left' },
            { label: 'Mitte', value: 'center' },
            { label: 'Rechts', value: 'right' },
          ]"
          size="xl"
          class="w-full"
          label="Ausrichtung"
        />
      </UFormField>
      <USwitch
        v-model="item.highlight"
        label="Hervorheben"
      />
      <UFormField
        label="Ziel"
        :ui="{ container: 'flex flex-col gap-2' }"
      >
        <USelect
          v-model="targetType"
          :items="[
            { label: 'Auf dieser Website', value: 'internal' },
            { label: 'Externer Link', value: 'external' },
          ]"
          size="xl"
          class="w-full"
        />
        <UInput
          v-if="targetType === 'external'"
          v-model="item.url"
          size="xl"
          class="w-full"
        />
        <USelect
          v-if="targetType === 'internal'"
          v-model="item.url"
          :items="internalTargets"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <USwitch
        v-model="item.openInNewTab"
        label="In neuem Fenster öffnen"
      />
    </template>
  </UCollapsible>
</template>