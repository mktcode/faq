<script setup lang="ts">
defineProps<{
  label?: string
}>()

const color = defineModel('color', {
  type: String,
  default: 'sky',
})
</script>

<template>
  <UFormField
    :label="label"
    class="flex-1"
  >
    <USelect
      v-model="color"
      class="w-full"
      :items="availableColors"
    >
      <template #leading="{ modelValue }">
        <div
          class="w-5 h-5 rounded-full border-2 border-gray-100"
          :class="getColorClass(modelValue)"
        />
      </template>
      <template #item="{ item }">
        <div class="flex items-center">
          <div
            class="w-5 h-5 rounded-full mr-2 border-2 border-gray-100"
            :class="getColorClass(item.value)"
          />
          {{ item.label }}
        </div>
      </template>
    </USelect>
  </UFormField>
</template>
