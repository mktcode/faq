<script setup lang="ts">
const show = ref(false)

const { partial } = defineProps<{
  partial: {
    id: number
    websiteId: number
    name: string
    description: string
    template: string
    css: string
  }
}>()

const isSaving = ref(false)

async function saveChanges() {
  isSaving.value = true
  await $fetch('/api/user/website/savePartial', {
    method: 'POST',
    body: {
      partialId: partial.id,
      template: partial.template,
    },
  })
  isSaving.value = false
}
</script>

<template>
  <UCollapsible
    v-model:open="show"
  >
    <UButton
      :label="partial.name"
      icon="i-lucide-layout-template"
      class="w-full rounded-none p-4 border-b border-gray-200"
      variant="ghost"
      color="neutral"
      trailing-icon="i-heroicons-chevron-right"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
    />

    <template #content>
      <div class="p-3">
        <p class="mb-2 text-sm text-gray-500">{{ partial.description }}</p>
      </div>
      <CodeEditor
        v-model:content="partial.template"
        language="html"
        class="h-64"
      />
      <UButton
        label="Änderungen speichern"
        icon="i-heroicons-check"
        class="mt-4"
        :loading="isSaving"
        @click="saveChanges"
      />
    </template>
  </UCollapsible>
</template>