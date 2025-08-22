<script setup lang="ts">
defineProps<{
  email: string
}>()

const open = ref(false)
</script>

<template>
  <UCollapsible
    v-model:open="open"
    class="flex flex-col gap-2"
    :ui="{
      root: 'border border-primary-500 rounded-lg',
      content: 'flex flex-col gap-2 px-3 pb-3',
    }"
  >
    <UButton
      :label="email"
      color="primary"
      variant="link"
      trailing-icon="i-heroicons-chevron-down"
      :ui="{
        trailingIcon: `ml-auto transition-transform ${open ? 'rotate-180' : ''}`,
      }"
    />

    <template #content>
      <p class="text-gray-500">
        Dazu gehen Sie zu Ihrem Domain-Anbieter und suchen eine Option wie "DNS-Einstellungen" oder "Records bearbeiten".
      </p>

      <UAlert
        title="Benötigen Sie Hilfe?"
        variant="soft"
        icon="i-lucide-headset"
      >
        <template #description>
          Sie können uns jederzeit unter <strong>support@solihost.de</strong> oder über den Live-Chat unten rechts auf Ihrer Website erreichen.
        </template>
      </UAlert>
    </template>
  </UCollapsible>
</template>
