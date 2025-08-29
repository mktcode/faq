<script setup lang="ts">
withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'transcript', transcript: string): void
}>()

const isRunning = defineModel('isRunning', {
  type: Boolean,
  default: false,
})

const { transcript, volumeHistory, isRecordingAudio, isTranscribingAudio, startRecordingAudio, stopRecordingAudio } = useAudioRecorder(75)

const maxRecordingTime = 30
const remainingRecordingTime = ref(maxRecordingTime)
const remainingInterval = ref<NodeJS.Timeout | null>(null)

watch(isRecordingAudio, (newValue) => {
  if (newValue) {
    isRunning.value = true
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

watch(isTranscribingAudio, (newValue) => {
  if (!newValue) {
    isRunning.value = false
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
    <div class="relative">
      <UButton
        v-if="isRecordingAudio"
        :label="`Aufnahme beenden (${remainingRecordingTime}s)`"
        variant="ghost"
        color="error"
        icon="i-heroicons-stop"
        size="xxl"
        class="rounded-xl gap-3 z-20 relative"
        @click="stopRecordingAudio"
      />
      <div
        id="wave"
        class="flex items-center justify-end h-12 min-w-0 w-full flex-1 absolute inset-0 pointer-events-none z-10"
      >
        <div
          v-if="isRecordingAudio"
          class="flex items-center justify-end gap-0.5 h-full overflow-hidden"
        >
          <div
            v-for="(level, index) in volumeHistory"
            :key="index"
            class="w-1 bg-error-400/20 rounded-full transition-all duration-150 min-h-[2px]"
            :style="{
              height: `${Math.min(100, Math.max(2, ((level * 1.5) / 100) * 100))}%`,
            }"
          />
        </div>
      </div>
    </div>
    <UButton
      v-if="isTranscribingAudio"
      label="Transkription läuft"
      variant="ghost"
      :loading="true"
      disabled
      size="xxl"
      class="rounded-xl gap-3"
    />
    <UButton
      v-if="!isRecordingAudio && !isTranscribingAudio"
      label="Aufnahme starten"
      icon="i-heroicons-microphone"
      variant="ghost"
      :disabled="disabled"
      size="xxl"
      class="rounded-xl gap-3"
      @click="startRecordingAudio"
    />
  </div>
</template>
