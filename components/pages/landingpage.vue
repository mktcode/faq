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
    class="font-poppins"
  >
    <div class="flex gap-2 p-4 justify-end">
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
          to="/login"
          variant="soft"
        >
          Anmelden
        </UButton>
      </template>
    </div>
    <div class="flex flex-col items-center justify-center max-w-3xl mx-auto pb-24 md:pb-32 px-4">
      <div
        class="text-center flex flex-col items-center max-w-2xl mx-auto"
      >
        <div class="text-sky-500 text-2xl font-bold flex items-center gap-4 mb-24 leading-none">
          <img
            src="~/assets/img/logo.png"
            alt="Logo"
            class="w-14"
          />
          <div class="text-left">
            Gewerbe<br>
            profil.de
          </div>
        </div>
        <h2 class="text-2xl">
          Wagen Sie gerade den Schritt in die Selbstständigkeit und überlegen, ob Sie eine Website brauchen?
        </h2>
        <h1 class="text-5xl font-bold mt-8 leading-tight">
          Nicht sofort. Werden Sie erstmal sichtbar!
        </h1>
      </div>
  
      <section class="mt-24 shadow-sky-50 flex flex-col">
        <p class="mt-4 text-gray-500 text-xl">
          Und das geht auch ohne großes Budget und sogar kostenlos kommen Sie schon sehr weit.
          Wir wollen verhindern, dass Ihr Unternehmergeist durch hohe Kosten und überdimensionierte Lösungen ausgebremst wird.
          Eins nach dem anderen.
        </p>
      </section>
  
      <ul class="mt-24 flex flex-col gap-4 text-gray-500 text-lg">
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Klarheit - Ist Ihr Angebot in einem Satz erklärbar? Wer (genau!) ist Ihre Zielgruppe?</strong><br>
            Wenn Sie nicht klar sagen können, was Sie wem bringen – wird’s auch kein anderer verstehen.
            Kostenlose KI-Tools wie <a class="text-sky-500" href="https://chat.openai.com/" target="_blank">ChatGPT</a> oder <a class="text-sky-500" href="https://gemini.google.com" target="_blank">Google Gemini</a> können Ihnen helfen,
            Klarheit zu gewinnen und professionelle Texte zu schreiben, z.B. für Kleinanzeigen oder Social Media Posts.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Passive Kundengewinnung: Google Unternehmensprofil</strong><br>
            Werden Sie gefunden. Das ist ebenfalls kostenlos und wesentlich wichtiger als eine Website, die ansonsten ohnehin kaum jemand findet, gerade am Anfang.
            Legen Sie sich ein <a class="text-sky-500" href="https://accounts.google.com/signup" target="_blank">Google-Konto</a> an (falls Sie noch keins haben) und schauen Sie sich eine der zahlreichen <a class="text-sky-500" href="https://www.youtube.com/results?search_query=google+unternehmensprofil+erstellen" target="_blank">Anleitungen auf YouTube</a> an.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span><strong class="text-gray-900">Aktive Kundengewinnung: Social Media und Anzeigenportale</strong> <br>
            Kleinanzeigen.de, nebenan.de, Instagram, Facebook oder TikTok – Es gibt viele kostenlose Plattformen, auf denen Sie aktiv werben und Kunden gewinnen können.
            Nutzen Sie diese Kanäle und kommen Sie mit Ihrer Zielgruppe in Kontakt.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span><strong class="text-gray-900">Social Proof: Bewertungen zählen mehr als ein schickes Design.</strong> <br>
          Bitten Sie Kunden, Ihr <a class="text-sky-500" href="https://support.google.com/business/answer/3474122?hl=de" target="_blank">Unternehmen auf Google zu bewerten</a> oder Ihnen auf Facebook und Co. zu folgen oder auf "Gefällt mir" zu klicken.
          Interagieren Sie mit Ihren Kunden, beantworten Sie Fragen und Kommentare und klären Sie kritische Rezensionen.
          Egal wie professionell Sie am Ende aufgestellt sind - "Mundpropaganda" und Empfehlungen bleiben wichtig.
        </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span><strong class="text-gray-900">Bilder sagen mehr als tausend Worte.</strong> <br>
          Heutige Smartphones machen erstaunlich gute Fotos und können diese auch gleich bearbeiten und optimieren.
          Achten Sie ein wenig auf gute Beleuchtung und gut sichtbare Motive und sparen Sie sich den teuren Fotografen, erstmal zumindest.
          Es spricht auch nichts gegen ein Video, wenn Sie sich damit wohlfühlen. Zeigen Sie sich und Ihre Arbeit!
        </span>
        </li>
      </ul>
  
      <p class="mt-24 text-gray-500 text-xl">
        Das alles kriegen Sie ganz alleine hin oder mit ein bisschen Hilfe aus dem Familien- und Freundeskreis.
        Wir können Ihnen dabei natürlich auch helfen, müssten dann aber einen üblichen Stundensatz (ab 50 €) dafür nehmen.
        Kommen Sie auf uns zurück, wenn Sie alleine nicht mehr weiterkommen bzw. wenn Sie bereit sind, den nächsten Schritt zu gehen.
      </p>

      <p class="mt-10 text-gray-500 text-xl">
        Das wäre bei uns dann das namensgebende <strong>Gewerbeprofil</strong> - eine einfache aber technisch und optisch einwandfreie Website,
        die Sie schnell eingerichtet haben, ohne dabei etwas falsch machen zu können.
      </p>
  
      <UButton
        to="/register/2"
        size="xxl"
        class="mt-12"
      >
        Mein Profil erstellen
      </UButton>
    </div>

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
