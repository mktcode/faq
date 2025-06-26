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

function startRecordingAudio() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.value = new MediaRecorder(stream)
        audioChunks.value = []

        isRecordingAudio.value = true
        mediaRecorder.value.start()

        mediaRecorder.value.addEventListener('dataavailable', (event) => {
          audioChunks.value.push(event.data)
        })

        mediaRecorder.value.addEventListener('stop', async () => {
          const mimeType = mediaRecorder.value?.mimeType || 'audio/ogg; codecs=opus'
          const audioBlob = new Blob(audioChunks.value, { type: mimeType })
          isRecordingAudio.value = false
          isTranscribingAudio.value = true

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
}
</script>

<template>
  <div>
    <UButton
      v-if="isRecordingAudio"
      variant="soft"
      color="error"
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
