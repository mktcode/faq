<script setup lang="ts">
const showModal = useState('showAssistantContextModal', () => false)

const { $profile, isSavingSettings, saveSettings } = useProfile()
</script>

<template>
  <USlideover
    v-model:open="showModal"
    side="left"
    close-icon="i-heroicons-arrow-left"
    :overlay="false"
    :ui="{
      body: 'flex flex-col gap-4',
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
        Assistent: Einstellungen
      </h3>
    </template>

    <template #body>
      <UFormField
        label="Zusätzlicher Kontext"
        description="Hinterlegen Sie Informationen, die dem Assistenten helfen, Ihre spezifischen Bedürfnisse zu verstehen."
        help="Tip: Der Assistent kann diese Informationen auch für Sie pflegen, wenn Sie im Gespräch darum bitten."
      >
        <UTextarea
          v-if="$profile.settings.private"
          v-model="$profile.settings.private.assistant.context"
          placeholder="Kontext"
          class="w-full"
          autoresize
          :disabled="isSavingSettings"
          :rows="2"
          :maxrows="10"
          spellcheck="false"
          :ui="{
            base: 'text-sm',
          }"
        />
      </UFormField>

      <UButton
        label="Speichern"
        :loading="isSavingSettings"
        @click="saveSettings"
      />
    </template>
  </USlideover>
</template>
