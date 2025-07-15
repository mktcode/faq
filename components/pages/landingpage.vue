<script setup lang="ts">
import backgroundUrl from '~/assets/img/lp-bg.png'

const { public: { appHost } } = useRuntimeConfig()
const { clear } = useUserSession()
const { me, refreshMe } = await useMe()

async function signOut() {
  await clear()
  refreshMe()
}
</script>

<template>
  <div
    class="font-poppins flex flex-col items-center justify-center max-w-3xl mx-auto py-24 md:py-32 px-4 bg-contain bg-top bg-no-repeat"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
  >
    <div
      class="text-center flex flex-col items-center max-w-2xl mx-auto"
    >
      <h2 class="text-2xl">
        Gerade selbstständig gemacht?
      </h2>
      <h1 class="text-5xl font-bold mt-2">
        Brauchen Sie eine Website?
      </h1>
      <div class="mt-8 flex gap-2">
        <template
          v-if="me"
        >
          <UButton
            :to="`https://${me.userName}.${appHost}`"
            label="Mein Gewerbeprofil"
            variant="soft"
          />
          <UButton
            label="Abmelden"
            variant="soft"
            @click="signOut"
          />
        </template>
        <template v-else>
          <UButton
            to="/register"
          >
            Nein, erstmal nicht.
          </UButton>
          <UButton
            to="/login"
            variant="soft"
          >
            Anmelden
          </UButton>
        </template>
      </div>
    </div>

    <section class="mt-24 shadow-sky-50 flex flex-col">
      <p class="mt-4 text-gray-500 text-xl">
        Bevor Sie zu viel (oder zu wenig) Geld für eine Website ausgeben,
        probieren Sie unser kostenloses Gewerbeprofil aus. Damit sind Sie sofort online und konzentrieren sich auf Ihre Inhalte und die Kommunikation mit Ihren Kunden.
      </p>
      <p class="mt-4 text-gray-500 text-xl">
        Eine individuelle, ästhetisch und inhaltlich professionell gestaltete Website ist dann der nächste Schritt und mit Ihrem Gewerbeprofil sind Sie bereits bestens vorbereitet.
        Schauen Sie sich am besten ein paar Beispiele an:
      </p>
    </section>

    <UCarousel
      v-slot="{ item }"
      loop
      :auto-scroll="{
        stopOnFocusIn: false,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        speed: 1,
      }"
      class="w-full mask-l-from-90% mask-r-from-90% max-w-3xl my-12"
      :items="[
        '',
        '',
        'https://nbg1.your-objectstorage.com/mktcms/1/icon.webp',
        '',
        '',
        '',
      ]"
      :ui="{ item: 'basis-1/4' }"
    >
      <a
        :href="`https://markuskottlaender.${appHost}`"
        target="_blank"
        class="block w-full aspect-square rounded-full"
        :class="{ 'bg-sky-50': !item }"
      >
        <NuxtImg
          v-if="item"
          :src="item"
          class="object-cover w-full h-full rounded-lg bg-white"
        />
      </a>
    </UCarousel>

    <UButton
      to="/register/2"
      size="xxl"
      class="mt-12"
    >
      Mein Profil erstellen
    </UButton>

    <div class="flex gap-6 mt-24 text-center text-sm text-gray-400">
      <NuxtLink
        to="https://markus-kottlaender.de/impressum"
        target="_blank"
      >
        Impressum
      </NuxtLink>
      <NuxtLink
        to="https://markus-kottlaender.de/datenschutz"
        target="_blank"
      >
        Datenschutz
      </NuxtLink>
    </div>
  </div>
</template>
