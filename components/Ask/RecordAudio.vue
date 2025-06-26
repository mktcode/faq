<script setup lang="ts">
defineProps<{
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'text', text: string): void
}>()

const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const isRecordingAudio = ref(false)
const isTranscribingAudio = ref(false)
const audioContext = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
const animationFrame = ref<number | null>(null)
const volumeLevel = ref(0)

function analyzeAudioLevel() {
  if (!analyser.value) return

  const bufferLength = analyser.value.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyser.value.getByteFrequencyData(dataArray)

  let sum = 0
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i]
  }
  const average = sum / bufferLength
  volumeLevel.value = Math.min(100, (average / 255) * 100)

  if (isRecordingAudio.value) {
    animationFrame.value = requestAnimationFrame(analyzeAudioLevel)
  }
}

function stopVolumeAnalysis() {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
    animationFrame.value = null
  }
  volumeLevel.value = 0

  if (audioContext.value && audioContext.value.state !== 'closed') {
    audioContext.value.close()
  }
  audioContext.value = null
  analyser.value = null
}

function startRecordingAudio() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.value = new MediaRecorder(stream)
        audioChunks.value = []

        audioContext.value = new AudioContext()
        const source = audioContext.value.createMediaStreamSource(stream)
        analyser.value = audioContext.value.createAnalyser()
        analyser.value.fftSize = 256
        source.connect(analyser.value)

        isRecordingAudio.value = true
        mediaRecorder.value.start()

        analyzeAudioLevel()

        mediaRecorder.value.addEventListener('dataavailable', (event) => {
          audioChunks.value.push(event.data)
        })

        mediaRecorder.value.addEventListener('stop', async () => {
          const mimeType = mediaRecorder.value?.mimeType || 'audio/ogg; codecs=opus'
          const audioBlob = new Blob(audioChunks.value, { type: mimeType })
          isRecordingAudio.value = false
          isTranscribingAudio.value = true

          stopVolumeAnalysis()

          const audioFormData = new FormData()
          audioFormData.append('data', audioBlob)

          const transcript = await $fetch<string>('/api/customerRequests/transcribe', {
            method: 'POST',
            body: audioFormData,
          })

          isTranscribingAudio.value = false

          emit('text', transcript)
        })
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`)
      })
  }
  else {
    console.info('getUserMedia not supported on your browser!')
  }
}

function stopRecordingAudio() {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop()
  }
  stopVolumeAnalysis()
}
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <div
      id="wave"
      class="flex items-center justify-center"
    >
      <div
        v-if="isRecordingAudio"
        class="flex items-center gap-1 h-full"
      >
        <div
          v-for="bar in 20"
          :key="bar"
          class="w-1 bg-gray-300 rounded-full transition-all duration-100"
          :style="{
            height: `${Math.max(2, (volumeLevel / 100) * 48 * Math.random() * 0.8 + volumeLevel / 100 * 48 * 0.2)}px`,
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
