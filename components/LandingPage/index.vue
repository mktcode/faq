<template>
  <div class="font-sans flex flex-col items-center justify-center h-screen">
    <h1 class="text-6xl font-bold">
      Nuxt App
    </h1>
    <div class="text-lg text-gray-600 mt-4 flex gap-6">
      <NuxtLink
        to="/register"
        class="text-blue-500 hover:underline"
      >
        Registrieren
      </NuxtLink>
      <NuxtLink
        to="/login"
        class="text-blue-500 hover:underline"
      >
        Anmelden
      </NuxtLink>
    </div>
  </div>
</template>
