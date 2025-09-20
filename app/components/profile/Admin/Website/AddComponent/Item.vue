<script setup lang="ts">
import type { AvailableComponent } from '~~/types/db';

const { component } = defineProps<{
  component: AvailableComponent
}>()

defineEmits<{
  add: []
  goToSubscription: []
}>()

const { $profile } = useProfile()

const hasRequiredPlan = computed(() => {
  if (!component.minPlan) return true
  if (!$profile.subscription.plan) return false

  return component.minPlan === 'S' ? ['S', 'L'].includes($profile.subscription.plan) : $profile.subscription.plan === 'L'
})
</script>

<template>
  <div class="flex flex-col">
    <div class="border-[16px] border-b-0 p-4 border-gray-100 rounded-xl rounded-b-none aspect-[16/9] w-full flex items-start justify-center text-gray-600 overflow-hidden">
      <slot name="preview">Vorschau</slot>
    </div>
    <div class="bg-gray-100 rounded-b-xl flex flex-col gap-4 p-4 flex-1">
      <div class="flex flex-col">
        <div class="font-semibold text-xl flex items-center gap-2">
          {{ component.title }}
          <UBadge
            v-if="!hasRequiredPlan"
            :label="`Paket ${component.minPlan}`"
            size="sm"
            variant="outline"
          />
        </div>
        <div class="text-sm text-gray-500">
          {{ component.description }}
        </div>
      </div>
      <UButton
        v-if="hasRequiredPlan"
        label="Hinzufügen"
        icon="i-heroicons-plus"
        class="mt-auto"
        block
        @click="$emit('add')"
      />
      <UButton
        v-else
        label="Upgrade erforderlich"
        icon="i-heroicons-arrow-up-tray"
        class="mt-auto"
        block
        @click="$emit('goToSubscription')"
      />
    </div>
  </div>
</template>