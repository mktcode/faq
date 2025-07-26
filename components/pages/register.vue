<script setup lang="ts">
const font = ref<AvailableFont>(availableFonts.value[0])
const color = ref<AvailableColor>(availableColors.value[0])
const about = ref('')
</script>

<template>
  <div class="h-screen flex flex-col justify-center gap-6 max-w-xl mx-auto p-6">
    <h1 class="text-5xl font-bold text-center">
      Alles klar, legen wir los!
    </h1>
    <section class="flex flex-col mt-10">
      <UFormField
        label="Was machen Sie? Was macht Sie aus?"
        class="mb-6"
      >
        <UTextarea
          v-model="about"
          placeholder="z.B. Maßschneiderin, ausschließlich nachhaltige Stoffe"
          class="w-full"
        />
      </UFormField>
      <div class="flex gap-4">
        <ColorPicker
          v-model="color"
          label="Primärfarbe"
          class="w-full max-w-lg mx-auto mb-6"
        />
        <FontPicker
          v-model="font"
          label="Schriftart"
          class="w-full max-w-lg mx-auto mb-6"
        />
      </div>
      <p class="text-gray-500 text-xl">
        Wählen Sie einen Benutzernamen. Für den Zugang wird ein Schlüssel auf Ihrem Gerät bzw. in Ihrem Passwort-Manager gespeichert.
      </p>
    </section>

    <RegisterForm />
  </div>
</template>
