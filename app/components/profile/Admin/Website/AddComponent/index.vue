<script setup lang="ts">
import { availableComponents } from '~~/types/db';

const open = defineModel('open', {
  type: Boolean,
  required: true,
})

const { $profile } = useProfile()

function addComponent(component: { title: string; description: string }) {
  // $profile.settings.public.components.push(component)
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
          v-for="component in availableComponents"
          :key="component.title"
          :component="component"
          @add="addComponent(component)"
        />
      </div>
    </template>
  </UModal>
</template>
