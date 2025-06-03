<script setup lang="ts">
import type { Qanda } from '~/types/db'

const { clear } = useUserSession()

const { data: me } = await useFetch('/api/user/me')
const qanda = ref<Qanda[]>([])

const showSettingsModal = ref(false)

const newQuestion = ref('')
const newAnswer = ref('')
const topic = ref('')

function logout() {
  clear()
  navigateTo('/')
}

onMounted(async () => {
  const qandaFromDb = await $fetch('/api/user/qanda')
  qanda.value = qandaFromDb || []
})

async function addNewQandA() {
  if (!newQuestion.value || !newAnswer.value) {
    return
  }

  const payload = {
    question: newQuestion.value,
    answer: newAnswer.value,
    topic: topic.value,
  }

  await $fetch('/api/user/catalogs/qanda', {
    method: 'POST',
    body: payload,
  })

  newQuestion.value = ''
  newAnswer.value = ''
  topic.value = ''
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 h-screen max-w-lg mx-auto">
    <div class="w-full flex items-center gap-2">
      <UButton
        icon="i-heroicons-cog-6-tooth"
        variant="soft"
        @click="showSettingsModal = true"
      />
    </div>
    <UButton
      v-if="me"
      :to="`/ask/${me.userName}`"
      :label="`autofaq.com/ask/${me.userName}`"
      trailing-icon="i-heroicons-arrow-right"
      variant="soft"
      block
    />
    <div class="py-6" />
    <div class="w-full flex items-center gap-2">
      <h3 class="text-lg font-semibold mt-4">
        New Question and Answer
      </h3>
      <UButton
        :label="`Manage (${qanda.length})`"
        class="ml-auto"
        size="lg"
      />
      <UButton
        label="Import"
        size="lg"
      />
    </div>
    <UInput
      v-model="topic"
      placeholder="Topic"
      class="w-full"
    />
    <UTextarea
      v-model="newQuestion"
      placeholder="Enter your question"
      class="w-full"
    />
    <UTextarea
      v-model="newAnswer"
      placeholder="Enter your answer"
      class="w-full"
    />
    <UButton
      label="Add"
      block
      @click="addNewQandA"
    />
    <div>
      <UButton
        label="logout"
        @click="logout"
      />
    </div>
  </div>
</template>
