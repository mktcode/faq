<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  name?: string
}>(), {
  label: 'Primäre Farbe',
  name: 'primaryColor',
})

const color = defineModel('color', {
  type: String,
  default: 'sky',
})

/**
 * Get the background class for a given color value
 */
function getColorClass(colorValue: string | undefined): string {
  if (!colorValue) return ''

  switch (colorValue) {
    case 'white': return 'bg-white'
    case 'black': return 'bg-black'
    case 'red': return 'bg-red-500'
    case 'orange': return 'bg-orange-500'
    case 'amber': return 'bg-amber-500'
    case 'yellow': return 'bg-yellow-500'
    case 'lime': return 'bg-lime-500'
    case 'green': return 'bg-green-500'
    case 'emerald': return 'bg-emerald-500'
    case 'teal': return 'bg-teal-500'
    case 'cyan': return 'bg-cyan-500'
    case 'sky': return 'bg-sky-500'
    case 'blue': return 'bg-blue-500'
    case 'indigo': return 'bg-indigo-500'
    case 'violet': return 'bg-violet-500'
    case 'purple': return 'bg-purple-500'
    case 'fuchsia': return 'bg-fuchsia-500'
    case 'pink': return 'bg-pink-500'
    case 'rose': return 'bg-rose-500'
    case 'slate': return 'bg-slate-500'
    case 'gray': return 'bg-gray-500'
    case 'zinc': return 'bg-zinc-500'
    case 'neutral': return 'bg-neutral-500'
    case 'stone': return 'bg-stone-500'
    default: return ''
  }
}
</script>

<template>
  <UFormField
    :label="label"
    :name="name"
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
