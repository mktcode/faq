<script setup lang="ts">
const faq = ref([
  {
    question: 'What is Mktcode?',
    answer: 'Mktcode is a platform for marketing automation and customer engagement.',
  },
  {
    question: 'How do I use Mktcode?',
    answer: 'You can use Mktcode by signing up and integrating it with your existing systems.',
  },
])
const question = ref('')
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 h-screen max-w-lg mx-auto">
    <div class="size-16 rounded-full bg-gray-200" />
    <h1 class="mb-12">
      Ask Mktcode
    </h1>
    <p class="text-gray-600 mb-4">
      Wenn Ihre Frage nicht beantwortet wird, können Sie uns gerne unter 0800 123 4567 oder per E-Mail an anfrage@meinefirma.de kontaktieren.
    </p>
    <UTextarea
      v-model="question"
      placeholder="Enter your question"
      class="w-full"
    />
    <UButton
      to="/ask/mktcode"
      label="Ask"
      block
    />
    <div>
      <div
        v-for="item in faq"
        :key="item.question"
      >
        <h3 class="text-lg font-semibold mt-4">
          {{ item.question }}
        </h3>
        <p class="text-gray-600">
          {{ item.answer }}
        </p>
      </div>
    </div>
  </div>
</template>
