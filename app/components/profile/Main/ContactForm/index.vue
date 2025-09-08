<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import type { SimilarQuestion } from '~~/server/api/qanda/similarQuestions.post'
import type { FormComponentSchema } from '~~/types/db';

const nuxtApp = useNuxtApp()
const { $profile } = nuxtApp

defineProps<{
  component: FormComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()

const message = ref('')
const messageLongEnough = computed(() => message.value.trim().length >= 5)
const messageEmbedding = ref<number[] | null>(null)
const similarQuestions = ref<SimilarQuestion[]>([])

async function getEmbedding() {
  if (!messageLongEnough.value || !$profile.subscription.plan) {
    return
  }

  const embedding = await $fetch('/api/qanda/embedding', {
    query: {
      message: message.value,
      username: $profile.username, // TODO: not really safe, needs origin based verification in backend
    },
  })

  messageEmbedding.value = embedding

  await getSimilarQuestions()
}

async function getSimilarQuestions() {
  if (messageEmbedding.value && messageEmbedding.value.length > 0) {
    const response = await $fetch('/api/qanda/similarQuestions', {
      method: 'POST',
      body: {
        username: $profile.username,
        embedding: messageEmbedding.value,
      },
    })

    similarQuestions.value = response
  }
}

watchDebounced(message, getEmbedding, { debounce: 2000 })
</script>

<template>
  <div class="w-full relative">
    <UButton
      v-if="$profile.isOwned"
      label="Sektion bearbeiten"
      trailing-icon="i-heroicons-pencil-square"
      variant="outline"
      size="xl"
      class="absolute top-4 -left-44 hover:-left-4 pl-5 transition-all rounded-full z-10"
      @click="$emit('edit', component.id)"
    />

    <div class="max-w-5xl mx-auto py-24 px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <ProfileMainContactFormHeader :component="component" />
        <ProfileMainContactFormBody :component="component" />
      </div>
    </div>
  </div>
</template>
