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
        Inhalt und Funktionen
      </h3>
    </template>
    <template #body>
      <DismissableAlert
        title="Wichtige Information"
        icon="i-heroicons-light-bulb"
        storageKey="content-info-dismissed"
        class="rounded-none"
      >
        Wir gehen davon aus, dass Sie am Anfang Ihrer Selbstständigkeit stehen.
        Viele Anforderungen gelten erst aber einer bestimmten Mitarbeiterzahl.
        Wenn Sie bereits mehr als 10 Mitarbeiter haben, ist ein Gewerbeprofil nicht das Richtige für Sie.
        <a href="https://markus-kottlaender.de" target="_blank" class="underline">Kontaktieren Sie uns</a> für eine individuelle Beratung.
      </DismissableAlert>
      <ContentModalAccordion />
    </template>
  </UModal>
</template>
