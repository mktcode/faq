<script setup lang="ts">
import type { HeaderComponentSchema } from '~~/types/db';

defineProps<{
  component: HeaderComponentSchema;
}>()
</script>

<template>
  <div
    id="header"
    class="w-full flex flex-col items-center justify-center relative z-0 overflow-hidden"
    :class="{
      'rounded-none': component.height === 'boxed' && $profile.settings.public.design.rounded === 'none',
      'rounded-md': component.height === 'boxed' && $profile.settings.public.design.rounded === 'md',
      'rounded-3xl': component.height === 'boxed' && $profile.settings.public.design.rounded === 'xl',
    }"
  >
    <slot />
  </div>
</template>
