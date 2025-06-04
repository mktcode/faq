<script setup lang="ts">
const { user } = useUserSession()

const showModal = defineModel('show', {
  default: true,
  type: Boolean,
})

const name = ref('')
const info = ref('')
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="size-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <UIcon
            name="i-heroicons-camera"
            class="text-gray-300"
            size="40"
          />
        </div>
        <UFormField label="Name">
          <UInput
            v-model="name"
            placeholder="Enter name"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Willkommenstext"
          description="Dieser Text wird auf deiner Profilseite angezeigt."
        >
          <UTextarea
            v-model="info"
            placeholder="Enter business information"
            class="w-full"
          />
        </UFormField>
        <div class="flex gap-2">
          <ColorPicker />
          <FontPicker />
        </div>
        <div>
          <USwitch
            label="Google Bewertungen anzeigen"
            description="Verbinde dich mit Google und wähle Bewertungen aus, die unter deinem FAQ stehen sollen."
          />
          <div
            v-if="user?.googleId"
            class="flex items-center gap-2 text-sm text-gray-500 ml-10 mt-2"
          >
            <USelect
              :items="[{ label: 'Ich war sehr zufrieden mit der Beratung', value: 'google-review-1' }]"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
