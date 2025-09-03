<script setup lang="ts">
import { availableComponents, type ComponentKey } from '~/types/db'

const { $profile } = useProfile()

const items = computed(() => {
  if (!$profile.settings) return []

  return Object.keys($profile.settings.public.components)
    .sort((a, b) => {
      const orderA = $profile.settings.public.components[a as ComponentKey].order || 0
      const orderB = $profile.settings.public.components[b as ComponentKey].order || 0
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
  const currentPosition = $profile.settings.public.components[key].order
  if (direction === 'up' && currentPosition <= 1) return
  if (direction === 'down' && currentPosition >= Object.keys($profile.settings.public.components).length) return

  const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1
  const adjacentComponentKey = Object.keys($profile.settings.public.components).find(
    key => $profile.settings.public.components[key as ComponentKey].order === newPosition,
  ) as ComponentKey | undefined

  if (adjacentComponentKey) {
    $profile.settings.public.components[key].order = newPosition
    $profile.settings.public.components[adjacentComponentKey].order = currentPosition
  }
}

function toggleVisibility(key: ComponentKey) {
  $profile.settings.public.components[key].visible = !$profile.settings.public.components[key].visible
}
</script>

<template>
  <UFormField
    label="Reihenfolge der Inhalte"
    :ui="{
      container: 'border border-gray-200 rounded-lg flex flex-col gap-2 pl-4 pr-2 py-2',
    }"
  >
    <TransitionGroup name="list">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="flex items-center"
      >
        <UIcon
          :name="item.icon"
          class="text-gray-500 size-5 mr-3"
        />
        {{ item.label }}
        <div class="ml-auto flex items-center">
          <UButton
            variant="ghost"
            size="sm"
            :color="$profile.settings.public.components[item.id as ComponentKey]?.visible ? 'primary' : 'neutral'"
            :class="$profile.settings.public.components[item.id as ComponentKey]?.visible ? 'text-primary-600' : 'text-gray-300'"
            @click.stop="toggleVisibility(item.id)"
          >
            <UIcon
              :name="$profile.settings.public.components[item.id as ComponentKey]?.visible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
              class="size-5"
            />
          </UButton>
          <UButton
            variant="ghost"
            size="sm"
            :disabled="index === 0"
            class="disabled:text-gray-400"
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
            :disabled="index >= items.length - 1"
            class="disabled:text-gray-400"
            @click.stop="changeOrder(item.id, 'down')"
          >
            <UIcon
              name="i-heroicons-arrow-down"
              class="size-5"
            />
          </UButton>
        </div>
      </div>
    </TransitionGroup>
  </UFormField>
</template>
