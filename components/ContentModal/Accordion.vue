<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import { availableComponents, type ComponentKey } from '~/types/db'

const { settings, saveSettings } = await useProfile()

const items = shallowRef<AccordionItem[]>(availableComponents.map(component => ({
  id: component.key,
  label: component.title,
  icon: component.icon,
  slot: component.key,
})) || [])

const form = ref(settings.value)

function changeOrder(key: ComponentKey, direction: 'up' | 'down') {
  if (!form.value || !form.value.components[key]) return

  const currentPosition = form.value.components[key].order
  if (direction === 'up' && currentPosition <= 1) return
  if (direction === 'down' && currentPosition >= Object.keys(form.value.components).length) return
  
  const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1
  const adjacentComponentKey = Object.keys(form.value.components).find(
    (key) => form.value?.components[key as ComponentKey].order === newPosition
  ) as ComponentKey | undefined;

  if (adjacentComponentKey) {
    form.value.components[key].order = newPosition
    form.value.components[adjacentComponentKey].order = currentPosition
  }

  saveSettings(form.value)
}

function toggleVisibility(key: ComponentKey) {
  if (!form.value || !form.value.components[key]) return
  form.value.components[key].visible = !form.value.components[key].visible
  saveSettings(form.value)
}
</script>

<template>
  <UAccordion
    :items="items"
    :unmount-on-hide="false"
    :ui="{
      header: 'px-4 hover:bg-gray-50',
    }"
  >
    <template #trailing="{ item, open }">
      <div class="ml-auto flex items-center">
        <UButton
          variant="ghost"
          size="sm"
          :color="form?.components[item.id as ComponentKey]?.visible ? 'primary' : 'neutral'"
          :class="form?.components[item.id as ComponentKey]?.visible ? 'text-primary-600' : 'text-gray-300'"
          @click.stop="toggleVisibility(item.id)"
        >
          <UIcon
            :name="form?.components[item.id as ComponentKey]?.visible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
            class="size-5"
          />
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          @click.stop="changeOrder(item.id, 'up')"
        >
          <UIcon
            name="i-heroicons-arrow-up"
            class="size-5"
          />
        </UButton>
        <UButton
          variant="ghost"
          size="sm"
          @click.stop="changeOrder(item.id, 'down')"
        >
          <UIcon
            name="i-heroicons-arrow-down"
            class="size-5"
          />
        </UButton>
        <UIcon
          name="i-heroicons-chevron-down"
          class="text-gray-500 size-5 ml-2 transition-transform"
          :class="{
            'rotate-180': open,
          }"
        />
      </div>
    </template>
    <template #gallery>
      <ContentModalGallery />
    </template>
    <template #offers>
      <ContentModalOffer />
    </template>
    <template #form>
      <ContentModalForm />
    </template>
    <template #downloads>
      <ContentModalDownloads />
    </template>
    <template #faq>
      <ContentModalFAQ />
    </template>
  </UAccordion>
</template>
