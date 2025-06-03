<script setup lang="ts">
const { clear } = useUserSession()
const { data: me, refresh: refreshMe } = await useFetch('/api/user/me')

function signOut() {
  clear()
  refreshMe()
}
</script>

<template>
  <div class="font-sans flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold">
      Brauchen Sie eine Website?
    </h1>
    <h2 class="text-2xl mt-4">
      Nein. Erstmal nicht.
    </h2>
    <div class="text-lg text-gray-600 mt-12 flex gap-6">
      <div
        v-if="me"
        class="flex flex-col items-center gap-2"
      >
        <div class="flex gap-2">
          <UButton
            :to="`/ask/${me.userName}`"
            label="App"
            variant="soft"
          />
          <UButton
            label="Abmelden"
            variant="soft"
            @click="signOut"
          />
        </div>
      </div>
      <template v-else>
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
      </template>
    </div>
  </div>
</template>
