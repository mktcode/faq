<script setup lang="ts">
const { saveSettings, resetSettings, isSavingSettings, unsavedSettings } = useProfile()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="unsavedSettings"
      class="flex w-full"
    >
      <UButton
        class="rounded-none p-4"
        size="md"
        label="Zurücksetzen"
        icon="i-heroicons-backward"
        variant="soft"
        @click="resetSettings"
      />
      <UButton
        class="w-full rounded-none p-4"
        size="md"
        label="Änderungen Speichern"
        icon="i-heroicons-check"
        :loading="isSavingSettings"
        @click="saveSettings"
      />
    </div>
  </Transition>
</template>
