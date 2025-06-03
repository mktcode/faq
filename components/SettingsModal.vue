<script setup lang="ts">
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
        <UFormField label="Name">
          <UInput
            v-model="name"
            placeholder="Enter name"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Information"
          description="This information will be displayed on your profile page."
        >
          <UTextarea
            v-model="info"
            placeholder="Enter business information"
            class="w-full"
          />
        </UFormField>
        <UButton
          label="Update"
          class="w-full"
        />
      </div>
    </template>
  </UModal>
</template>
