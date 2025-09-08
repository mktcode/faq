<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const { showWebsiteFaqSettings, go } = useAdmin()

const isDesktop = useMediaQuery('(min-width: 640px)')

const { data: qanda, refresh: refreshQanda } = await useFetch('/api/user/qanda')

const suggestions = ref<{
  id: number | null
  question: string
  answer: string
  original: {
    id: number
    question: string
    answer: string
  } | null
}[]>([])

const showNewForm = ref(false)
const newQuestion = ref('')
const newAnswer = ref('')

const isSaving = ref(false)

async function saveQanda() {
  isSaving.value = true
  await $fetch('/api/user/qanda', {
    method: 'POST',
    body: {
      question: newQuestion.value,
      answer: newAnswer.value,
    },
  })
  await refreshQanda()
  isSaving.value = false
  showNewForm.value = false
}
</script>

<template>
  <UDrawer
    :open="showWebsiteFaqSettings"
    :direction="isDesktop ? 'left' : 'bottom'"
    close-icon="i-heroicons-arrow-left"
    handle-only
    :overlay="false"
    :close-threshold="0.85"
    :ui="{
      content: 'shadow-2xl shadow-black',
      container: 'relative max-w-md no-scrollbar',
      handle: '!bg-gray-400',
      header: 'h-10',
      body: 'flex flex-col gap-4',
    }"
    @close="() => go('#website')"
  >
    <template #header>
      <ProfileMainDrawerTip />
      <h3 class="text-lg font-semibold flex gap-2">
        <UIcon
          name="i-heroicons-question-mark-circle"
          class="inline-block size-6 opacity-50"
        />
        Häufige Fragen
        <div class="flex items-center gap-2 ml-auto">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            color="neutral"
            size="md"
            @click="go('#website')"
          />
        </div>
      </h3>
    </template>

    <template #body>
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        class="flex flex-col gap-2 p-3 border border-gray-300 rounded-lg"
      >
        <h3 class="text-lg font-semibold flex justify-between">
          {{ suggestion.question }}
          <UBadge
            :label="suggestion.id === null ? 'Neu' : 'Aktualisierung'"
            variant="soft"
            :color="suggestion.id === null ? 'success' : 'primary'"
          />
        </h3>
        <h3
          v-if="suggestion.original"
          class="text-sm text-gray-500 line-through"
        >
          {{ suggestion.original.question }}
        </h3>
        <p class="text-sm text-gray-600">
          {{ suggestion.answer }}
        </p>
        <p
          v-if="suggestion.original"
          class="text-sm text-gray-500 line-through"
        >
          {{ suggestion.original.answer }}
        </p>
        <div class="flex gap-2 mt-2">
          <UButton
            label="Akzeptieren"
            icon="i-heroicons-check"
            variant="solid"
            size="md"
            class="flex-1"
          />
          <UButton
            label="Ablehnen"
            icon="i-heroicons-x-mark"
            variant="soft"
            size="md"
            class="flex-1"
          />
        </div>
      </div>
      <UButton
        label="Neue Frage hinzufügen"
        icon="i-heroicons-plus"
        variant="solid"
        block
        @click="showNewForm = !showNewForm"
      />
      <Transition name="fade">
        <div
          v-if="showNewForm"
          class="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg"
        >
          <UFormField
            label="Frage"
            description="Geben Sie eine typische Frage Ihrer Zielgruppe ein."
          >
            <UTextarea
              v-model="newQuestion"
              placeholder="Was ist der Unterschied zwischen Vue und React?"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Antwort"
            description="Geben Sie eine möglichst genaue und umfassende Antwort auf diese Frage ein."
          >
            <WysiwygEditor
              v-model="newAnswer"
              placeholder="Vue ist ein progressives JavaScript-Framework, während React eine JavaScript-Bibliothek ist..."
            />
          </UFormField>
          <UButton
            icon="i-heroicons-plus"
            variant="solid"
            block
            :loading="isSaving"
            :disabled="!newQuestion || !newAnswer"
            @click="saveQanda"
          >
            Frage hinzufügen
          </UButton>
        </div>
      </Transition>
      <div class="flex flex-col gap-4">
        <div
          v-for="item in qanda"
          :key="item.id"
          class="flex flex-col p-3 border border-gray-200 rounded-lg"
        >
          <UCollapsible
            class="flex flex-col"
            :unmount-on-hide="false"
          >
            <div class="flex items-center justify-between gap-2 group">
              <UInput
                v-model="item.question"
                placeholder="Geben Sie Ihre Frage hier ein..."
                class="w-full"
              />
              <UButton
                variant="ghost"
                class="flex-1 group"
                block
                trailing-icon="i-lucide-chevron-down"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
                }"
              />
            </div>

            <template #content>
              <WysiwygEditor
                v-model="item.answer"
                placeholder="Geben Sie Ihre Antwort hier ein..."
              />
              <div class="flex gap-2 mt-4">
                <UButton
                  label="Löschen"
                  icon="i-heroicons-trash"
                  variant="soft"
                  block
                />
                <UButton
                  label="Speichern"
                  icon="i-heroicons-check"
                  variant="solid"
                  block
                />
              </div>
            </template>
          </UCollapsible>
        </div>
      </div>
    </template>
  </UDrawer>
</template>
