<script setup lang="ts">
import type { FormComponentSchema } from '~~/types/db';

defineProps<{
  component: FormComponentSchema;
}>()

defineEmits<{
  edit: [componentId: number]
}>()
</script>

<template>
  <ProfileMainSection
    :component="component"
    @edit="$emit('edit', $event)"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
      <ProfileMainContactFormHeader :component="component" />
      <ProfileMainContactFormBody :component="component" />
    </div>
  </ProfileMainSection>
</template>
