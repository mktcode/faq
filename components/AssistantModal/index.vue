<script setup lang="ts">
const showModal = useState('showAssistantModal', () => false)

const quota = useState('assistantQuota', () => 12)
</script>

<template>
  <USlideover
    v-model:open="showModal"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: '!p-0',
    }"
    :close="{
      size: 'md',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-lucide-bot"
          class="inline-block size-6 opacity-50"
        />
        Assistent
      </h3>
    </template>

    <template #body>
      <DismissableAlert
        title="Ihr KI-Assistent"
        icon="i-lucide-info"
        storage-key="assistant-info-dismissed"
        class="rounded-none"
      >
        Ihr Assistent kennt Ihre Website und damit auch Ihr Unternehmen.
        Weitere Informationen können Sie hinzufügen, damit nicht immer wieder die selben Rückfragen kommen.
        Sie können Fragen stellen oder Änderungen an Ihrer Website besprechen und umsetzen lassen.
        Speichern Sie Ihre Eingaben als wiederverwendbare Vorlagen und nutzen Sie die mitgelieferten.
      </DismissableAlert>
      <UProgress
        v-model="quota"
        :ui="{ base: 'rounded-none' }"
      />
      <div class="p-4">
        <div class="flex flex-col gap-4">
          <UButton
            label="Informationen bearbeiten"
            icon="i-lucide-edit"
            color="neutral"
            variant="outline"
            class="w-full"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <UTextarea
        placeholder="Frage an den Assistenten..."
        class="w-full"
        :rows="2"
      />
    </template>
  </USlideover>
</template>
