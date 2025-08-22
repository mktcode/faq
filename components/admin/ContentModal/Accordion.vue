<script setup lang="ts">
import { availableComponents, type ComponentKey } from '~/types/db'

const { settings, saveSettings } = await useProfile()

const items = computed(() => {
  if (!settings.value) return []

  return Object.keys(settings.value.components)
    .sort((a, b) => {
      const orderA = settings.value?.components[a as ComponentKey].order || 0
      const orderB = settings.value?.components[b as ComponentKey].order || 0
      return orderA - orderB
    })
    .map(key => ({
      id: key as ComponentKey,
      label: availableComponents.find(component => component.key === key)?.title || '',
      icon: availableComponents.find(component => component.key === key)?.icon || '',
      slot: key,
    }))
})

function changeOrder(key: ComponentKey, direction: 'up' | 'down') {
  const currentPosition = settings.value.components[key].order
  if (direction === 'up' && currentPosition <= 1) return
  if (direction === 'down' && currentPosition >= Object.keys(settings.value.components).length) return

  const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1
  const adjacentComponentKey = Object.keys(settings.value.components).find(
    key => settings.value.components[key as ComponentKey].order === newPosition,
  ) as ComponentKey | undefined

  if (adjacentComponentKey) {
    settings.value.components[key].order = newPosition
    settings.value.components[adjacentComponentKey].order = currentPosition
  }

  saveSettings()
}

function toggleVisibility(key: ComponentKey) {
  settings.value.components[key].visible = !settings.value.components[key].visible
  saveSettings()
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
          :color="settings.components[item.id as ComponentKey]?.visible ? 'primary' : 'neutral'"
          :class="settings.components[item.id as ComponentKey]?.visible ? 'text-primary-600' : 'text-gray-300'"
          @click.stop="toggleVisibility(item.id)"
        >
          <UIcon
            :name="settings.components[item.id as ComponentKey]?.visible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
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
