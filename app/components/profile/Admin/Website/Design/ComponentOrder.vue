<script setup lang="ts">
import { availableComponents } from '~~/types/db'
import { moveArrayElement } from '@vueuse/integrations/useSortable'

const { $profile } = useProfile()

const items = computed(() => {
  return $profile.settings.public.components
    .sort((a, b) => {
      return a.order - b.order
    })
    .map((component) => {
      const found = availableComponents.find(c => c.key === component.key)
      return {
        ...component,
        icon: found?.icon || 'i-heroicons-cube',
      }
    })
})

function changeOrder(index: number, direction: 'up' | 'down') {
  const to = direction === 'up' ? index - 1 : index + 1

  moveArrayElement($profile.settings.public.components, index, to)
}

function toggleVisibility(index: number) {
  if (!$profile.settings.public.components[index]) return
  
  $profile.settings.public.components[index].visible = !$profile.settings.public.components[index].visible
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
        :key="item.key + index"
        class="flex items-center"
      >
        <UIcon
          :name="item.icon"
          class="text-gray-500 size-5 mr-3"
        />
        {{ item.title }}
        <div class="ml-auto flex items-center">
          <UButton
            variant="ghost"
            size="sm"
            :color="item.visible ? 'primary' : 'neutral'"
            :class="item.visible ? 'text-primary-600' : 'text-gray-300'"
            @click.stop="toggleVisibility(index)"
          >
            <UIcon
              :name="item.visible ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
              class="size-5"
            />
          </UButton>
          <UButton
            variant="ghost"
            size="sm"
            :disabled="index === 0"
            class="disabled:text-gray-400"
            @click.stop="changeOrder(index, 'up')"
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
            @click.stop="changeOrder(index, 'down')"
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
