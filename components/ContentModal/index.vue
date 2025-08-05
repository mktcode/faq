<script setup lang="ts">
defineEmits(['update'])

const showModal = useState('showContentModal', () => false)
</script>

<template>
  <UModal
    v-model:open="showModal"
    :ui="{
      body: '!p-0',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-letter-text"
          class="inline-block size-6 opacity-50"
        />
        Inhalt und Funktion
      </h3>
    </template>
    <template #body>
      <DismissableAlert
        title="Sichtbarkeit und Reihenfolge"
        icon="i-heroicons-light-bulb"
        storage-key="content-info-dismissed"
        class="rounded-none"
      >
        Ihre Website besteht aus den unten aufgeführten Inhalten. Ändern Sie die Reihenfolge
        <UIcon
          name="i-heroicons-arrows-up-down"
          class="inline-block size-4 text-white align-top"
        />
        und blenden Sie Bereiche aus
        <UIcon
          name="i-heroicons-eye"
          class="inline-block size-4 text-white align-top"
        />, die Sie nicht nutzen möchten.
      </DismissableAlert>
      <ContentModalAccordion @update="$emit('update')" />
    </template>
  </UModal>
</template>
