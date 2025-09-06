<script setup lang="ts">
import { availableComponents, type SettingsForm } from '~~/types/db';

const open = defineModel('open', {
  type: Boolean,
  required: true,
})

const { $profile } = useProfile()

function addComponent(component: SettingsForm['public']['components'][0]) {
  $profile.settings.public.components.push(component)
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    title="Sektion hinzufügen"
    description="Wählen Sie eine Sektion aus, die Sie Ihrer Webseite hinzufügen möchten."
    :ui="{
      footer: 'justify-between'
    }"
  >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileAdminWebsiteAddComponentItem
          v-for="availableComponent in availableComponents"
          :key="availableComponent.title"
          :component="availableComponent"
          @add="addComponent($event)"
        />
      </div>
    </template>
  </UModal>
</template>
