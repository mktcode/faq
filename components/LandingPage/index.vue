<script setup lang="ts">
import backgroundUrl from '~/assets/img/lp-bg.png'

const { public: { appHost } } = useRuntimeConfig()
const { clear } = useUserSession()
const { me, refreshMe } = await useMe()

function signOut() {
  clear()
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
            target="_blank"
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

    <section class="mt-24 p-6 shadow-sky-50 flex flex-col">
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
      to="/register"
      size="xxl"
      class="mt-12"
    >
      Mein Profil erstellen
    </UButton>

    <h2 class="w-full px-6 text-3xl font-bold mt-32">
      Was wollen Ihre Kunden wissen?
    </h2>

    <section class="p-6 shadow-sky-50 flex flex-col">
      <p class="mt-6 text-gray-500 text-xl">
        Eine Liste mit häufig gestellten Fragen (FAQ) zu erstellen, ist nicht nur für Ihre Kunden hilfreich,
        sondern auch für Sie selbst. Zusammen mit dem Anfrageformular stellt das FAQ die Kernfunktion Ihres Gewerbeprofils dar.
      </p>

      <p class="mt-4 text-gray-500 text-xl">
        Das Anfrageformular zeigt Ihren Besuchern relevante Antworten aus Ihrem FAQ direkt beim Ausfüllen an.
        Beantworten Sie eine eingehende Anfrage, wird automatisch erkannt, ob Ihr FAQ überarbeitet werden kann.
        Die angezeigten Vorschläge müssen Sie dann nur noch bestätigen oder anpassen.
      </p>
    </section>

    <h2 class="w-full px-6 text-3xl font-bold mt-32">
      Was ist mit Domain und E-Mail?
    </h2>

    <section class="p-6 shadow-sky-50 flex flex-col">
      <p class="mt-6 text-gray-500 text-xl">
        Das ist so eine Sache. Technisch gesehen brauchen Sie keine eigene Domain und nichtmal eine E-Mail-Adresse.
        Ihr Gewerbeprofil ist sofort unter <i>ihr-name.gewerbeprofil.de</i> erreichbar und Sie können Anfragen direkt in der App empfangen und beantworten.
      </p>
      <p class="mt-4 text-gray-500 text-xl">
        Für den Anfang und auch ein bisschen darüber hinaus reicht das. Eine eigene Domain und eine professionelle E-Mail-Adresse wirken aber natürlich nochmal etwas besser.
      </p>
      <p class="mt-4 text-gray-500 text-xl">
        Eine Domain können Sie für 1 € mtl. direkt in der App registrieren und für Ihr Gewerbeprofil und später für Ihre Website und E-Mail-Adressen verwenden.
      </p>
    </section>

    <h2 class="w-full px-6 text-3xl font-bold mt-32">
      Ich will aber eine Website!
    </h2>

    <section class="p-6 shadow-sky-50 flex flex-col">
      <p class="mt-6 text-gray-500 text-xl">
        Klar! Wir können Sie dazu beraten und auch die Umsetzung übernehmen.
        Es gilt der Grundsatz: Die Form folgt der Funktion.
        D.h. wir müssen uns zunächst ohnehin über Ihre Inhalte und Ziele unterhalten, bevor wir über das Design und die Technik sprechen können.
      </p>
      <p class="mt-4 text-gray-500 text-xl">
        Und dabei hilft Ihnen und uns ein Gewerbeprofil ebenfalls. Sie müssen es auch nicht veröffentlichen.
        Durch den begrenzten Spielraum hilft es Ihnen aber, Gedanken zu sortieren und Inhalte zu priorisieren und wir bekommen ein klareres Bild von Ihrem Bedarf.
      </p>
    </section>

    <UButton
      to="/register"
      size="xxl"
      class="mt-12"
    >
      Vorbereitung starten
    </UButton>
  </div>
</template>
