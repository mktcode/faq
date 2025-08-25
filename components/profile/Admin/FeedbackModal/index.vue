<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const showModal = useState('showFeedbackModal', () => false)

const feedbackEmail = ref(`feedback@solohost.de`)
const { copy: copyEmail, copied: copiedEmail } = useClipboard()
</script>

<template>
  <UModal
    v-model:open="showModal"
    :ui="{
      body: 'flex flex-col gap-4 text-gray-500',
    }"
  >
    <template #title>
      <h3 class="text-lg font-semibold flex items-center gap-2">
        <UIcon
          name="i-heroicons-chat-bubble-left-right"
          class="inline-block size-6 opacity-50"
        />
        Feedback
      </h3>
    </template>
    <template #body>
      <p>
        Da wir uns noch in der Testhase befinden, sind wir auf Ihr Feedback angewiesen. Bitte teilen Sie uns mit, was Ihnen gefällt, was verbessert werden kann oder welche Funktionen Sie sich wünschen.
      </p>
      <p>
        Wir nutzen die Entwickler-Plattform GitHub, um Feedback möglichst einheitlich zu sammeln und direkt dort, wo wir arbeiten.
        Wenn Sie einen Google Account haben, können Sie sich darüber bei GitHub anmelden.
      </p>
      <UButton
        label="Feedback auf GitHub einreichen"
        color="neutral"
        icon="i-lucide-github"
        trailing-icon="i-lucide-external-link"
        to="https://github.com/mktcode/faq/issues/new?template=qa-feedback.md"
        target="_blank"
        :ui="{
          trailingIcon: 'ml-auto opacity-50',
        }"
      />
      <p>
        Sie können uns natürlich auch gerne direkt per E-Mail kontaktieren, wenn Sie das bevorzugen.
      </p>
      <UButton
        :label="copiedEmail ? 'E-Mail kopiert!' : feedbackEmail"
        trailing-icon="i-heroicons-clipboard-document"
        variant="outline"
        :ui="{
          trailingIcon: 'ml-auto opacity-50',
        }"
        @click="copyEmail(feedbackEmail)"
      />
    </template>
  </UModal>
</template>
