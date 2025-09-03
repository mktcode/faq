<script setup lang="ts">
const options = defineModel('options', {
  type: Array<{ label: string }>,
  default: () => [],
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="block font-medium text-sm">
      Auswahlmöglichkeiten
    </label>
    <div
      v-for="(option, index) in options"
      :key="index"
      class="flex items-center gap-2"
    >
      <UInput
        v-model="option.label"
        placeholder="Option"
        class="w-full"
      />
      <UButton
        variant="soft"
        color="error"
        icon="i-heroicons-trash"
        @click="options.splice(index, 1)"
      />
    </div>
    <UButton
      label="Option hinzufügen"
      variant="soft"
      color="primary"
      icon="i-heroicons-plus"
      @click="options.push({ label: `Option ${options.length + 1}` })"
    />
  </div>
</template>
