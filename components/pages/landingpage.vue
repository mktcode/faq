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
        <div class="text-sky-500 text-2xl font-bold flex items-start gap-4 mb-24 leading-none">
          <img
            src="~/assets/img/logo.png"
            alt="Logo"
            class="w-14"
          />
          <div class="text-left">
            Gewerbe<br>
            profil.de<br>
            <span class="text-gray-400 text-sm font-light float-right">beta</span>
          </div>
        </div>
        <h2 class="text-2xl">
          Wagen Sie gerade den Schritt in die Selbstständigkeit und überlegen, ob Sie eine Website brauchen?
        </h2>
        <h1 class="text-5xl font-bold mt-8 leading-tight">
          Nicht sofort. Werden Sie erstmal sichtbar!
        </h1>

        <UButton
          label="Ich will aber jetzt!"
          to="/register"
          size="xxl"
          class="mt-12"
          variant="soft"
        />
      </div>
  
      <section class="mt-24 shadow-sky-50 flex flex-col">
        <p class="mt-4 text-gray-500 text-xl">
          Und das geht auch ohne großes Budget und sogar kostenlos kommen Sie schon sehr weit.
          Wir wollen verhindern, dass Ihr Unternehmergeist durch hohe Kosten und überdimensionierte Lösungen ausgebremst wird.
          Eins nach dem anderen, Schritt für Schritt.
        </p>
      </section>

      <h2 class="text-3xl font-bold mt-24">
        Schritt 1: Sichtbar werden
      </h2>
  
      <ul class="mt-10 flex flex-col gap-4 text-gray-500 text-lg">
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Klarheit: Ist Ihr Angebot in einem Satz erklärbar? Wer (genau!) ist Ihre Zielgruppe?</strong><br>
            Wenn Sie nicht klar sagen können, was Sie wem bringen – wird’s auch kein anderer verstehen.
            Kostenlose KI-Tools wie <a class="text-sky-500" href="https://chat.openai.com/" target="_blank">ChatGPT</a> oder <a class="text-sky-500" href="https://gemini.google.com" target="_blank">Google Gemini</a> können Ihnen helfen,
            Klarheit zu gewinnen und professionelle Texte zu schreiben, z.B. für Kleinanzeigen oder Social Media Posts. Auch bei rechtlichen und steuerlichen Fragen können Sie diese Tools eine gute Orientierung geben.
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
        Kommen Sie auf uns zurück, wenn Sie alleine nicht mehr weiterkommen bzw. wenn Sie bereit sind, den nächsten Schritt zu gehen.
      </p>

      <h2 class="text-3xl font-bold mt-24">
        Schritt 2: Herausstechen
      </h2>

      <p class="mt-10 text-gray-500 text-xl">
        Das geht mit einer eigenen Website sehr gut und auch hier gibt es zahlreiche Möglichkeiten, die nicht viel kosten müssen.
        Mit Baukastensystemen wie <a href="https://www.wix.com" target="_blank" class="text-sky-500">Wix</a>, <a href="https://www.jimdo.com" target="_blank" class="text-sky-500">Jimdo</a>, <a href="https://www.squarespace.com" target="_blank" class="text-sky-500">Squarespace</a> oder <a href="https://www.wordpress.com" target="_blank" class="text-sky-500">WordPress</a> können Sie aus vorhandenen Vorlagen eine Website erstellen.
        Da Sie an Google ohnehin nicht vorbeikommen, bietet sich auch <a href="https://sites.google.com" target="_blank" class="text-sky-500">Google Sites</a> an, das Sie kostenlos nutzen können.
      </p>

      <p class="mt-10 text-gray-500 text-xl">
        Das ist eine völlig legitime Möglichkeit. Profis werden natürlich erkennen, dass Sie keinen Webdesigner engagiert haben. Ihren Kunden wird das aber kaum auffallen.
        Trotzdem gibt es ein paar Punkte, die Sie beachten sollten, damit es nicht unprofessionell wirkt oder rechtliche Probleme gibt.
      </p>

      <ul class="mt-10 flex flex-col gap-4 text-gray-500 text-lg">
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Der erste Eindruck: Suchmaschinen und soziale Medien</strong><br>
            Suchen Sie Ihrer Website bei Google. Welche Überschrift und Beschreibung wird dort angezeigt?
            Auch Messenger-Dienste wie WhatsApp oder soziale Medien zeigen eine Vorschau, wenn Sie einen Link zu Ihrer Website teilen.
            Achten Sie darauf, dass nicht einfach irgendein zufälliges Bild und ein Platzhaltertext angezeigt wird.
            Ihre Website hat auch ein kleines Icon, das sog. Favicon, das z.B. in Suchergebnissen und Lesezeichen angezeigt wird.
            Bei unzähligen Seiten ist das immernoch das Logo von WordPress und Co., weil vergessen wurde, es zu ändern.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Cookie Einwilligung: Brauchen Sie NICHT!</strong><br>
            Zerstören Sie sich nicht selbst Ihre Website, indem Sie eine Cookie-Einwilligung einbauen oder einbauen lassen.
            Das nervt die Besucher und sorgt für längere Ladezeiten und frühzeitige Absprünge potenzieller Kunden.
            Sie brauchen keine Cookie-Einwilligung, wenn Sie keine Cookies verwenden, die personenbezogene Daten speichern.
            Und die verwenden Sie nicht, solange Sie keine Analyse-Tools wie Google Analytics nutzen, die für Ihre Zwecke völlig überdimensioniert sind.
            Diese Tools brauchen Sie nur, wenn Sie die Umsätze durch Ihre Website bis auf den letzten Klick genau optimieren wollen.
            Lassen Sie sich nichts aufschwatzen, was Sie nicht brauchen und sogar schadet.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Mobiloptimierung: Ein guter Eindruck auf allen Geräten</strong><br>
            Egal wie und wo Sie Ihre Website erstellen, Ihnen wird versprochen werden, dass sie auf allen Geräten gut aussieht.
            Prüfen Sie das! Der Klassiker sind überdimensionierte Schriftgrößen und unglücklich platzierte Elemente, die das Layout sprengen.
            Das Ergebnis von Baukastensystemen (und leider auch von Agenturen) erfordert oft noch einiges an Detailarbeit, damit es wirklich gut aussieht.
            Schauen Sie sich Ihre Website mindestens auf dem Smartphone und einem Desktop-Bildschirm an.
            Und auch wenn das Internet mal etwas langsamer ist, sollte Ihre Website mehr oder weniger sofort sichtbar sein.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Weniger ist mehr: Funktionierende Landingpage statt zig Unterseiten</strong><br>
            Konzentrieren Sie sich auf klare und prägnante Angebotsseiten (sog. Landingpage), die alle wichtigen Informationen enthalten,
            die potentielle Kunden benötigen um eine Entscheidung zu treffen.
            Das heißt nicht, dass Sie sämtliche Persönlichkeit weglassen sollen.
            Vor allem nicht, wenn Sie genau das von anderen abhebt.
            Ein kurzer "Über Mich" Abschnitt kann auch auf mehreren Seiten auftauchen, wenn es für den Lese- und Entscheidungsfluss sinnvoll ist.
            Vermeiden Sie es nur, eine Unterseite nach der anderen zu erstellen, weil Ihnen dieses oder jenes noch einfällt.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Domain und E-Mail: Ihr digitaler Grundbesitz</strong><br>
            Eine Website braucht eine Domain, also das, was Sie in die Adresszeile des Browsers eingeben, z.B. gewerbeprofil.de.
            Unter einer solchen Domain können dann auch E-Mail-Adressen eingerichtet werden, z.B. info@gewerbeprofil.de.
            Das wirkt professioneller als @gmail.com oder @web.de. Wenn Sie die allerdings bereits auf 500 Visitenkarten gedruckt haben, dann ist das auch völlig okay.
            Zumal eine E-Mail-Adresse unter eigener Domain dann definitiv mit Kosten verbunden ist.
            Für eine Domain mit .de am Ende sollten Sie nicht mehr als 10 Euro pro Jahr bezahlen.
            Für die dazugehörige E-Mail-Adresse kommen dann nochmal ca. 0,50 bis 2 oder 3 Euro pro Monat dazu, je nach Anbieter und Speicherplatz.
            Letztlich wollen wir an dieser Stelle nur betonen: Entscheidend für Ihren Erfolg ist beides nicht.
            Konzentrieren Sie sich erstmal auf Ihre Inhalte.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Rechtliches: Impressum und Datenschutz</strong><br>
            Da Sie gewerblich tätig sind, ist ein Impressum Pflicht und auch um eine Datenschutzerklärung kommen Sie nicht herum.
            Für beides gibt es online <a class="text-sky-500" href="https://www.e-recht24.de/impressum-generator.html" target="_blank">Generatoren</a>, die Ihnen helfen, diese Inhalte zu erstellen.
            Leider liegt der Teufel hier im Detail. So muss z.B. die Datenschutzerklärung aktualisiert werden, wenn Sie bestimmte Inhalte auf Ihrer Website einbinden.
            Sogar die verwendete Schriftart kann Auswirkungen haben, wenn Sie technisch nicht korrekt implementiert ist.
            Viele nutzen daher vorgefertigte Lösungen, die dann haufenweise Paragraphen enthalten, die sie gar nicht betreffen und dazu führen, dass es wirklich niemand mehr liest, außer den Abmahnanwälten.
            Dabei sollte eine Datenschutzerklärung eigentlich einen Zweck erfüllen: Vertrauen schaffen. Lesen Sie doch mal <a class="text-sky-500" href="/datenschutz" target="_blank">unsere</a>.
          </span>
        </li>
      </ul>

      <h2 class="text-3xl font-bold mt-24">
        Dürfen wir Ihnen ein Angebot machen?
      </h2>

      <p class="mt-10 text-gray-500 text-xl">
        Das wäre dann das namensgebende <strong>Gewerbeprofil</strong> - eine einfache aber technisch, optisch und rechtlich einwandfreie Website,
        die Sie schnell eingerichtet haben, ohne dabei etwas falsch machen zu können.
      </p>

      <p class="mt-10 text-gray-500 text-xl">
        ...
      </p>
  
      <UButton
        to="/register"
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
