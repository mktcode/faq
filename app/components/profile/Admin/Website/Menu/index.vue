<script setup lang="ts">
import type { MenuComponentSchema } from '~~/types/db'

const component = defineModel('component', {
  type: Object as () => MenuComponentSchema,
  required: true,
})
</script>

<template>
  <div class="flex flex-col w-full">
    <TransitionGroup name="list">
      <ProfileAdminWebsiteMenuItem
        v-for="(_, index) in component.items"
        :key="index"
        v-model:item="component.items[index]!"
        @delete="component.items.splice(index, 1)"
      />
    </TransitionGroup>
    <UButton
      label="Menüpunkt hinzufügen"
      class="w-full rounded-none p-4 border-b border-primary-200"
      variant="soft"
      trailing-icon="i-heroicons-plus"
      :ui="{
        trailingIcon: 'ml-auto opacity-30',
      }"
      @click="component.items.push({ title: 'Neuer Menüpunkt', url: '/', openInNewTab: false })"
    />
  </div>
</template>