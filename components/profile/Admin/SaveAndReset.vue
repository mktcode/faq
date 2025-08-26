<script setup lang="ts">
const { saveSettings, resetSettings, isSavingSettings, unsavedSettings } = useProfile()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="unsavedSettings"
      class="ml-auto flex items-end gap-2"
    >
      <UButton
        icon="i-heroicons-backward"
        size="md"
        variant="ghost"
        @click="resetSettings"
      />
      <UButton
        icon="i-heroicons-check"
        size="md"
        :loading="isSavingSettings"
        @click="saveSettings"
      />
    </div>
  </Transition>
</template>