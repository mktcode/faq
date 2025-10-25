<script setup lang="ts">
const show = ref(false)

const { page } = defineProps<{
  page: {
    id: number
    websiteId: number
    name: string
    description: string
    template: string
    css: string
    js: string
  }
}>()

const isSaving = ref(false)

async function saveChanges() {
  isSaving.value = true
  await $fetch('/api/user/website/savePage', {
    method: 'POST',
    body: {
      pageId: page.id,
      template: page.template,
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
      :label="page.name"
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
        <p class="mb-2 text-sm text-gray-500">{{ page.description }}</p>
      </div>
      <CodeEditor
        v-model:content="page.template"
        language="handlebars"
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