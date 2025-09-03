<script setup lang="ts">
defineEmits(['update:userInput'])
</script>

<template>
  <div class="p-4 flex flex-col gap-1 mt-auto">
    <UButton
      label="Befrage mich zu meinem Unternehmen."
      color="neutral"
      variant="outline"
      class="w-full"
      icon="i-lucide-message-circle-question-mark"
      trailing-icon="i-lucide-arrow-down"
      size="md"
      :ui="{
        trailingIcon: 'ml-auto opacity-40',
      }"
      @click="$emit('update:userInput', 'Befrage mich zu meinem Unternehmen und lass uns gemeinsam den Unternehmenskontext aufbauen.')"
    />
    <UButton
      label="Erzähle mir einen Witz über Online-Marketing."
      color="neutral"
      variant="outline"
      class="w-full"
      icon="i-lucide-smile"
      trailing-icon="i-lucide-arrow-down"
      size="md"
      :ui="{
        trailingIcon: 'ml-auto opacity-40',
      }"
      @click="$emit('update:userInput', 'Erzähle mir einen Witz über Online-Marketing.')"
    />
    <UButton
      label="Lass uns die Angebotstexte bearbeiten."
      color="neutral"
      variant="outline"
      class="w-full"
      icon="i-lucide-edit-2"
      trailing-icon="i-lucide-arrow-down"
      size="md"
      :ui="{
        trailingIcon: 'ml-auto opacity-40',
      }"
      @click="$emit('update:userInput', 'Lass uns die Angebotstexte bearbeiten.')"
    />
    <UButton
      label="Erstelle einen Post für Social Media mit Bild."
      color="neutral"
      variant="outline"
      class="w-full"
      icon="i-lucide-image-plus"
      trailing-icon="i-lucide-arrow-down"
      size="md"
      :ui="{
        trailingIcon: 'ml-auto opacity-40',
      }"
      @click="$emit('update:userInput', 'Erstelle ein Bild für Social Media.')"
    />
    <UButton
      label="Wie ändere ich das Bild oben?"
      color="neutral"
      variant="outline"
      class="w-full"
      icon="i-lucide-book-open-text"
      trailing-icon="i-lucide-arrow-down"
      size="md"
      :ui="{
        trailingIcon: 'ml-auto opacity-40',
      }"
      @click="$emit('update:userInput', 'Wie ändere ich das Bild oben?')"
    />
  </div>
</template>
