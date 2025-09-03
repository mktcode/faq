<script setup lang="ts">
withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  transcript: [transcript: string]
}>()

const { transcript, volumeHistory, isRecordingAudio, isTranscribingAudio, startRecordingAudio, stopRecordingAudio } = useAudioRecorder()

const maxRecordingTime = 30
const remainingRecordingTime = ref(maxRecordingTime)
const remainingInterval = ref<NodeJS.Timeout | null>(null)

watch(isRecordingAudio, (newValue) => {
  if (newValue) {
    remainingRecordingTime.value = maxRecordingTime
    remainingInterval.value = setInterval(() => {
      if (remainingRecordingTime.value > 0) {
        remainingRecordingTime.value -= 1
      }
    }, 1000)
  }
  else {
    if (remainingInterval.value) {
      clearInterval(remainingInterval.value)
    }
    remainingRecordingTime.value = maxRecordingTime
  }
})

watch(remainingRecordingTime, (newValue) => {
  if (newValue === 0) {
    stopRecordingAudio()
  }
})

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
      :label="`Aufnahme beenden (${remainingRecordingTime}s)`"
      variant="soft"
      color="error"
      icon="i-heroicons-stop"
      @click="stopRecordingAudio"
    />
    <UButton
      v-if="isTranscribingAudio"
      label="Transkription läuft"
      variant="soft"
      :loading="true"
      disabled
    />
    <UButton
      v-if="!isRecordingAudio && !isTranscribingAudio"
      label="Aufnahme starten"
      icon="i-heroicons-microphone"
      variant="soft"
      :disabled="disabled"
      @click="startRecordingAudio"
    />
  </div>
</template>
