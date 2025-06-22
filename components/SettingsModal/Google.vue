<script setup lang="ts">
const toast = useToast()

const emit = defineEmits(['update'])

const { me } = await useMe()

const { data: currentSettings } = await useFetch(`/api/user/settings`)

const { data: reviews } = await useFetch('/api/user/google/reviews')

const form = ref({
  showGoogleReviews: currentSettings.value?.showGoogleReviews || false,
})

async function saveSettings() {
  await $fetch('/api/user/settings', {
    method: 'POST',
    body: form.value,
  })
  toast.add({
    title: 'Einstellungen gespeichert',
    description: 'Deine Einstellungen wurden erfolgreich gespeichert.',
    color: 'success',
  })
  emit('update')
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <UFormField
      label="Google Bewertungen"
      description="Verbinde dich mit Google und wähle Bewertungen aus, die unter deinem FAQ stehen sollen."
    >
      <USwitch
        v-model="form.showGoogleReviews"
        label="Sterne und Bewertungen anzeigen"
        class="mt-3"
      />
    </UFormField>
    <div v-if="form.showGoogleReviews">
      <div v-if="!me?.googleId" class="text-red-600">
        Du hast noch kein Google-Konto verbunden. Bitte verbinde dein Konto, um
        Google Bewertungen anzuzeigen.

        <UButton
          label="Google verbinden"
          variant="solid"
          color="primary"
          class="mt-2"
        />
      </div>
      <div v-else>
        <p class="text-gray-700">
          Du kannst deine Google Bewertungen hier verwalten. Aktuell sind
          folgende Bewertungen verfügbar:
        </p>
        <ul class="list-disc pl-5 mt-2">
          <li v-for="(review, index) in reviews" :key="index">
            {{ review }}
          </li>
        </ul>
      </div>
    </div>

    <UButton
      variant="solid"
      color="primary"
      class="mt-4"
      @click="saveSettings"
    >
      Einstellungen speichern
    </UButton>
  </div>
</template>
