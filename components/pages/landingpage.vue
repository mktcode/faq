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
          label="Mein Profil"
          icon="i-heroicons-identification"
          variant="ghost"
        />
        <UButton
          label="Abmelden"
          icon="i-heroicons-power"
          variant="ghost"
          @click="signOut"
        />
      </template>
      <template v-else>
        <UButton
          to="/login"
          variant="ghost"
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
          <UIcon
            name="i-heroicons-identification"
            class="size-16 -mt-2"
          />
          <div class="text-left">
            Gewerbe<br>
            profil.de<br>
            <span class="text-gray-400 text-sm font-light float-right">beta</span>
          </div>
        </div>
        <h2 class="text-2xl">
          Wagen Sie gerade als Freiberufler oder Einzelunternehmer den Schritt in die Selbstständigkeit und überlegen, ob Sie eine Website brauchen?
        </h2>
        <h1 class="text-5xl font-bold mt-24 leading-tight">
          Nicht sofort. Werden Sie erstmal sichtbar!
        </h1>
      </div>
  
      <section class="mt-12 shadow-sky-50 flex flex-col">
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
            Beim heutigen Konsumverhalten hilft es, wenn Sie in Überschriftenlänge oder maximal zwei bis drei kurzen Sätzen erklären können, was Sie anbieten und für wen.
            Kostenlose KI-Tools wie <a class="text-sky-500" href="https://chat.openai.com/" target="_blank">ChatGPT</a> oder <a class="text-sky-500" href="https://gemini.google.com" target="_blank">Google Gemini</a> können Ihnen helfen,
            Klarheit zu gewinnen und professionelle Texte zu schreiben, z.B. für Kleinanzeigen oder Social Media Posts. Auch bei rechtlichen und steuerlichen Fragen können diese Tools eine gute erste Orientierung geben.
            Lesen Sie unsere <a class="text-sky-500" href="/" target="_blank">Prompt-Anleitung</a> für gute Ergebnisse.
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
          Heutige Smartphones machen gute Fotos und können diese auch gleich bearbeiten und optimieren.
          Achten Sie ein wenig auf gute Beleuchtung und gut sichtbare Motive und sparen Sie sich den teuren Fotografen, erstmal zumindest.
          Es spricht auch nichts gegen ein Video, wenn Sie sich damit wohlfühlen. Zeigen Sie sich und Ihre Arbeit!
        </span>
        </li>
      </ul>
  
      <p class="mt-10 text-gray-500 text-xl">
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
        All diese Anbieter werden in naher Zukunft auch eine vollständig KI-basierte Erstellung von Websites anbieten oder tun es bereits.
        Das heißt, Sie unterhalten sich mit Ihrem Computer oder Smartphone, wie mit einem Agenturmitarbeiter und der Rest geht von alleine.
        Ganz da sind wir noch nicht, aber es ist nur eine Frage der Zeit. Fragen Sie doch mal <a href="https://chat.openai.com/" target="_blank" class="text-sky-500">ChatGPT</a> oder <a href="https://claude.ai/" target="_blank" class="text-sky-500">Claude</a>, ob es Ihnen eine Website erstellen kann.
        Sie werden erstaunt sein.
      </p>

      <p class="mt-10 text-gray-500 text-xl">
        Aber egal welchen Weg sie wählen, es gibt Aspekte einer Website, die nicht sofort ins Auge fallen und gerne vernachlässigt werden.
      </p>

      <ul class="mt-10 flex flex-col gap-4 text-gray-500 text-lg">
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Der erste Eindruck: Suchmaschinen und soziale Medien</strong><br>
            Welche Überschrift und Beschreibung wird bei Google und Co. angezeigt?
            Auch Messenger-Dienste wie WhatsApp oder soziale Medien zeigen eine Vorschau, wenn Sie einen Link zu Ihrer Website teilen.
            Achten Sie darauf, dass nicht einfach irgendein zufälliges Bild und ein Platzhaltertext angezeigt wird.
            Ihre Website hat auch ein kleines Icon, das sog. Favicon, das z.B. in Suchergebnissen und Lesezeichen angezeigt wird.
            Bei unzähligen Seiten ist das immernoch das Logo von WordPress und Co., weil vergessen wurde, es auszutauschen.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Künstliche Intelligenz: Haben Sie keine Angst davor!</strong><br>
            KI wird zunehmend in Suchmaschinen eingesetzt, um Inhalte zu analysieren und das best mögliche Ergebnis zu liefern.
            Nutzer fragen auch immer häufiger direkt ChatGPT und Co. nach Empfehlungen für Produkte und Dienstleistungen.
            Die KI durchforstet dann das Internet und liefert einen maßgeschneiderten Vorschlag.
            Damit Ihre Website dabei berücksichtigt werden kann, sind einige technische Details zu beachten.
            Es macht also Sinn, die eigene Website daraufhin zu optimieren oder zumindest die grundlegende Zugänglichkeit für KI-Tools zu gewährleisten.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Mobiloptimierung: Ein guter Eindruck auf allen Geräten</strong><br>
            Egal wie und wo Sie Ihre Website erstellen, Ihnen wird versprochen werden, dass sie auf allen Geräten gut aussieht.
            Prüfen Sie das! Der Klassiker sind überdimensionierte Schriftgrößen und unglücklich platzierte Elemente, die das Layout sprengen.
            Das Ergebnis von Baukastensystemen erfordert oft noch einiges an Detailarbeit, damit es wirklich gut aussieht.
            Schauen Sie sich Ihre Website mindestens auf dem Smartphone und einem Desktop-Bildschirm an.
            Und auch wenn das Internet mal etwas langsamer ist, sollte Ihre Website mehr oder weniger sofort sichtbar sein.
          </span>
        </li>
        <li class="flex items-start">
          <span class="text-sky-500 text-4xl mr-2">✔</span>
          <span>
            <strong class="text-gray-900">Weniger ist mehr: Funktionierende Landingpage statt zig Unterseiten</strong><br>
            Konzentrieren Sie sich auf klare und prägnante Angebotsseiten (sog. Landingpage), die alle wichtigen Informationen enthalten,
            die potentielle Kunden benötigen, um eine Entscheidung zu treffen.
            Das heißt nicht, dass Sie sämtliche Persönlichkeit weglassen sollen.
            Vor allem nicht, wenn Sie genau das von anderen abhebt.
            Ein kurzer "Über Mich" Abschnitt kann auch auf mehreren Seiten auftauchen, wenn es für den Lese- und Entscheidungsfluss sinnvoll ist.
            Vermeiden Sie es nur, eine Unterseite nach der anderen zu erstellen, weil Ihnen dieses oder jenes noch einfällt.
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
            Es reicht auch erstmal ein einfacher Aufrufzähler.
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

      <p class="mt-10 text-gray-500 text-xl">
        Diese Liste ist nicht vollständig. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>

      <h2 class="text-3xl font-bold mt-24">
        Dürfen wir Ihnen ein Angebot machen?
      </h2>

      <p class="mt-10 text-gray-500 text-xl">
        Unser <strong>Gewerbeprofil</strong> ist eine einfache aber technisch, optisch und rechtlich einwandfreie Website,
        die Sie schnell eingerichtet haben, ohne dabei technisch etwas falsch machen zu können.
      </p>

      <p class="mt-10 text-gray-500 text-xl">
        Die Struktur ist weitestgehend vorgegeben und optische Anpassungsmöglichkeiten sind begrenzt.
        Aber Sie sind online, mit einer Website, die mehr ist und noch werden kann, als ein Social Media Profil.
        Sie ist Ihr zentraler Anlaufpunkt im Internet, auf dem Sie mit Bild und Text Ihr Unternehmen vorstellen und Anfragen entgegennehmen und auf Ihre weiteren Profile auf anderen Plattformen verweisen können.
      </p>

      <p class="mt-10 text-gray-500 text-xl">
        Von diesem Punkt aus können Sie Ihre Website dann weiter ausbauen - mit unserer Expertise und Unterstützung.
        Die "Basisausstattung" ist <strong>kostenlos</strong>. Ihr Profil wird unter einer Subdomain erreichbar sein, z.B. musterfirma.gewerbeprofil.de und sie nutzen weiterhin Ihre vorhandene @gmail.com E-Mail-Adresse.
      </p>

      <p class="mt-10 text-gray-500 text-xl">
        Für <strong>15 €</strong> im Monat können Sie Ihre eigene Domain einrichten, z.B. musterfirma.de und bekommen eine E-Mail-Adresse unter dieser Domain, z.B. info@musterfirma.de.
        Außerdem eröffnet uns dieser Beitrag die Möglichkeit, Ihre Website mit Ihnen weiter auszubauen, mit individuellen Designanpassungen, mehr Inhalt und zusätzlichen Funktionen, wie einem Buchungskalender, Bezahlfunktion oder Anfragen per Sprachnachricht.
        Und ja, auch die KI-Steuerung ist bereits in Arbeit, muss aber wirklich noch etwas reifen.
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
