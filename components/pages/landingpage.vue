<script setup lang="ts">
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
    class="font-poppins flex flex-col items-center justify-center max-w-3xl mx-auto py-24 md:py-32 px-4"
  >
    <div
      class="text-center flex flex-col items-center max-w-2xl mx-auto"
    >
      <h2 class="text-2xl">
        Wagen Sie gerade den Schritt in die Selbstständigkeit?
      </h2>
      <h1 class="text-5xl font-bold mt-2">
        Werden Sie sichtbar!
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
            Registrieren
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
        Das geht auch ohne großes Budget. Sogar kostenlos kommen Sie schon sehr weit.
        Wir wollen verhindern, dass Ihr Unternehmergeist durch hohe Kosten und überdimensionierte Lösungen ausgebremst wird.
      </p>
    </section>

    <ul class="mt-10 flex flex-col gap-4 text-gray-500 text-lg">
      <li class="flex items-start">
        <span class="text-sky-500 text-4xl mr-2">✔</span>
        <span>
          <strong class="text-gray-900">Ist Ihr Angebot in einem Satz erklärbar? Wer (genau!) ist Ihre Zielgruppe?</strong><br>
          Wenn Sie nicht klar sagen können, was Sie wem bringen – wird’s auch kein anderer verstehen.
          Kostenlose KI-Tools wie <a class="text-sky-500" href="https://chat.openai.com/" target="_blank">ChatGPT</a> oder <a class="text-sky-500" href="https://gemini.google.com" target="_blank">Google Gemini</a> können Ihnen helfen, Klarheit zu gewinnen.
        </span>
      </li>
      <li class="flex items-start">
        <span class="text-sky-500 text-4xl mr-2">✔</span>
        <span>
          <strong class="text-gray-900">Google Unternehmensprofil eingerichtet?</strong><br>
          Das ist ebenfalls kostenlos und wesentlich wichtiger als eine Website, die ansonsten ohnehin niemand findet.
          Legen Sie sich ein <a class="text-sky-500" href="https://accounts.google.com/signup" target="_blank">Gmail-Konto</a> an und schauen Sie sich eine der zahlreichen <a class="text-sky-500" href="https://www.youtube.com/results?search_query=google+unternehmensprofil+erstellen" target="_blank">Anleitungen auf YouTube</a> an.
        </span>
      </li>
      <li class="flex items-start">
        <span class="text-sky-500 text-4xl mr-2">✔</span>
        <span><strong class="text-gray-900">Erste Kundenmeinungen oder Referenzen?</strong> <br>
        Bewertungen zählen mehr als ein schickes Design.</span>
      </li>
      <li class="flex items-start">
        <span class="text-sky-500 text-4xl mr-2">✔</span>
        <span><strong class="text-gray-900">Aktives Social Media Profil?</strong> <br>
        Egal ob Instagram, LinkedIn oder TikTok – Hauptsache Sie zeigen sich und interagieren.</span>
      </li>
    </ul>

    <p class="mt-10 text-gray-500 text-xl">
      Haben Sie diese Punkte abgehakt, können Sie sich um eine Website kümmern,... wenn Sie dann überhaupt noch eine brauchen.
      Bevor Sie zu viel (oder zu wenig) Geld für eine Website ausgeben,
      probieren Sie unser kostenloses Gewerbeprofil aus. Damit sind Sie sofort online und konzentrieren sich auf Ihre Inhalte und die Kommunikation mit Ihren Kunden.
    </p>

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
