<script setup lang="ts">
const { privateSettings, isSavingPrivateSettings, savePrivateSettings } = await usePrivateSettings()

const editContextOpen = ref(false)
</script>

<template>
  <UCollapsible
    v-if="privateSettings"
    v-model:open="editContextOpen"
    class="flex flex-col gap-2"
    :ui="{
      root: 'border-b border-gray-200',
      content: 'flex flex-col gap-2 px-3 pb-3',
    }"
  >
    <UButton
      icon="i-heroicons-building-office-2"
      label="Unternehmenskontext bearbeiten"
      color="neutral"
      variant="link"
      trailing-icon="i-heroicons-chevron-down"
      :ui="{
        leadingIcon: 'size-5',
        trailingIcon: `ml-auto transition-transform ${editContextOpen ? 'rotate-180' : ''}`,
      }"
    />

    <template #content>
      <UTextarea
        v-model="privateSettings.assistant.context"
        placeholder="Kontext"
        class="w-full"
        autoresize
        :disabled="isSavingPrivateSettings"
        :rows="2"
        :maxrows="10"
        :ui="{
          base: 'text-sm',
        }"
      />

      <UButton
        label="Speichern"
        :loading="isSavingPrivateSettings"
        @click="savePrivateSettings"
      />
    </template>
  </UCollapsible>
</template>