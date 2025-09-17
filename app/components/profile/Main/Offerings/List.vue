<script setup lang="ts">
import type { OfferingComponentSchema } from '~~/types/db';

defineProps<{
  component: OfferingComponentSchema;
}>()
</script>

<template>
  <div class="flex flex-col gap-y-24">
    <TransitionGroup name="list">
      <div
        v-for="item in component.items"
        :key="item.id"
        class="flex flex-col md:flex-row items-start gap-4"
      >
        <img
          v-if="item.image"
          :src="item.image"
          alt="Offering Image"
          class="rounded-lg shrink-0 mt-0 max-w-1/3"
        />
        <div>
          <h2 class="font-semibold mt-0">
            {{ item.title }}
          </h2>
          <div
            v-html="item.description"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
