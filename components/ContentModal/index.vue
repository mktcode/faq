<script setup lang="ts">
defineEmits(['update'])

const showModal = useState('showContentModal', () => false)
</script>

<template>
  <UModal
    v-model:open="showModal"
    :close="false"
    :ui="{
      body: '!p-0',
    }"
  >
    <template #body>
      <TestAcc />
    </template>
  </UModal>
</template>
