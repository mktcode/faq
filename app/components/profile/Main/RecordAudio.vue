<script setup lang="ts">
defineProps<{
  disabled: boolean
}>()

const emit = defineEmits<{
  transcript: [text: string]
}>()

const { transcript, volumeHistory, isRecordingAudio, isTranscribingAudio, startRecordingAudio, stopRecordingAudio } = useAudioRecorder()

watch(transcript, (newTranscript) => {
  if (newTranscript) {
    emit('transcript', newTranscript)
  }
})
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <div
      id="wave"
      class="flex items-center justify-end h-12 min-w-0 flex-1"
    >
      <div
        v-if="isRecordingAudio"
        class="flex items-center justify-end gap-0.5 h-full overflow-hidden"
      >
        <div
          v-for="(level, index) in volumeHistory"
          :key="index"
          class="w-1 bg-gray-300 rounded-full transition-all duration-150 min-h-[2px]"
          :style="{
            height: `${Math.min(100, Math.max(2, ((level * 1.5) / 100) * 100))}%`,
          }"
        />
      </div>
    </div>
    <UButton
      v-if="isRecordingAudio"
      variant="soft"
      icon="i-heroicons-stop"
      @click="stopRecordingAudio"
    />
    <UButton
      v-if="isTranscribingAudio"
      variant="soft"
      :loading="true"
    />
    <UButton
      v-if="!isRecordingAudio && !isTranscribingAudio"
      icon="i-heroicons-microphone"
      variant="soft"
      :disabled="disabled"
      @click="startRecordingAudio"
    />
  </div>
</template>
