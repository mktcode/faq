<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const { public: { appHost } } = useRuntimeConfig()
const { clear } = useUserSession()
const { me, refreshMe } = await useMe()

async function signOut() {
  await clear()
  refreshMe()
}

const acc1items = ref<AccordionItem[]>([
  {
    label: 'Klarheit: Ist Ihr Angebot in einem Satz erklärbar? Wer (genau!) ist Ihre Zielgruppe?',
    slot: 'slot1',
  },
  {
    label: 'Passive Kundengewinnung: Ihr Google Unternehmensprofil',
    slot: 'slot2',
  },
  {
    label: 'Aktive Kundengewinnung: Social Media und Anzeigenportale',
    slot: 'slot3',
  },
  {
    label: 'Social Proof: Bewertungen zählen mehr als ein schickes Design.',
    slot: 'slot4',
  },
  {
    label: 'Zeigen Sie sich: Bilder sagen mehr als tausend Worte.',
    slot: 'slot5',
  },
])
const acc1active = ref<string | undefined>('0')
const acc1ItemsOpened = ref<string[]>(['0'])
watch(acc1active, (newVal) => {
  if (newVal) {
    if (!acc1ItemsOpened.value.includes(newVal)) {
      acc1ItemsOpened.value.push(newVal)
    }
  }
})

const acc2items = ref<AccordionItem[]>([
  {
    label: 'Der erste Eindruck: Suchmaschinen und soziale Medien',
    slot: 'slot1',
  },
  {
    label: 'Künstliche Intelligenz: Haben Sie keine Angst davor!',
    slot: 'slot2',
  },
  {
    label: 'Mobiloptimierung: Ein guter Eindruck auf allen Geräten',
    slot: 'slot3',
  },
  {
    label: 'Weniger ist mehr: Funktionierende Landingpage statt zig Unterseiten',
    slot: 'slot4',
  },
  {
    label: 'Cookie Einwilligung: Brauchen Sie NICHT!',
    slot: 'slot5',
  },
  {
    label: 'Domain und E-Mail: Ihr digitaler Grundbesitz',
    slot: 'slot6',
  },
  {
    label: 'Rechtliches: Impressum und Datenschutz',
    slot: 'slot7',
  },
])
const acc2active = ref<string | undefined>('0')
const acc2ItemsOpened = ref<string[]>(['0'])
watch(acc2active, (newVal) => {
  if (newVal) {
    if (!acc2ItemsOpened.value.includes(newVal)) {
      acc2ItemsOpened.value.push(newVal)
    }
  }
})
</script>

<template>
  <div
    class="font-poppins"
  >
    <div class="flex gap-2 p-4 justify-center sm:justify-end">
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
    <div class="flex flex-col items-center justify-center max-w-3xl mx-auto pt-16 sm:pt-24 pb-24 sm:pb-32 px-4">
      <div
        class="text-center flex flex-col items-center max-w-2xl mx-auto"
      >
        <div class="text-sky-500 text-2xl sm:text-4xl font-bold flex items-start gap-4 mb-16 sm:mb-24 leading-none">
          <UIcon
            name="i-heroicons-identification"
            class="size-16 sm:size-24 -mt-2"
          />
          <div class="text-left">
            Gewerbe<br>
            profil.de<br>
            <span class="text-gray-400 text-sm font-light float-right">beta</span>
          </div>
        </div>
        <h2 class="text-xl sm:text-2xl">
          Wagen Sie gerade als Freiberufler oder Einzelunternehmer den Schritt in die Selbstständigkeit und überlegen, ob Sie eine Website brauchen?
          Nicht sofort. Werden Sie erstmal sichtbar!
        </h2>
      </div>

      <h2 class="text-2xl sm:text-3xl font-bold mt-24 mb-10">
        Schritt 1: Sichtbar werden
      </h2>

      <UAccordion
        v-model="acc1active"
        :items="acc1items"
        :ui="{
          root: 'flex flex-col gap-3',
          trigger: 'px-4 hover:bg-gray-50',
          label: 'text-gray-900 text-lg font-bold',
          leadingIcon: 'text-sky-500 size-8',
          content: 'text-gray-500 text-lg pt-4 p-4',
          item: 'border last:border border-gray-200 rounded-lg',
        }"
      >
        <template #leading="{ index }">
          <span
            class="text-sky-500 text-4xl mr-2"
            :class="{
              'opacity-30 grayscale': !acc1ItemsOpened.includes(index.toString()),
            }"
          >✔</span>
        </template>
        <template #slot1>
          Beim heutigen Konsumverhalten hilft es, wenn Sie in Überschriftenlänge oder maximal zwei bis drei kurzen Sätzen erklären können, was Sie anbieten und für wen.
          Kostenlose KI-Tools wie <a class="text-sky-500" href="https://chat.openai.com/" target="_blank">ChatGPT</a> oder <a class="text-sky-500" href="https://gemini.google.com" target="_blank">Google Gemini</a> können Ihnen helfen,
          Klarheit zu gewinnen und professionelle Texte zu schreiben, z.B. für Kleinanzeigen oder Social Media Posts. Auch bei rechtlichen und steuerlichen Fragen können diese Tools eine gute erste Orientierung geben.
          Lesen Sie unsere <a class="text-sky-500" href="/" target="_blank">Prompt-Anleitung</a> für gute Ergebnisse.
        </template>
        <template #slot2>
          Werden Sie gefunden. Das ist ebenfalls kostenlos und wesentlich wichtiger als eine Website, die ansonsten ohnehin kaum jemand findet, gerade am Anfang.
          Legen Sie sich ein <a class="text-sky-500" href="https://accounts.google.com/signup" target="_blank">Google-Konto</a> an (falls Sie noch keins haben) und schauen Sie sich eine der zahlreichen <a class="text-sky-500" href="https://www.youtube.com/results?search_query=google+unternehmensprofil+erstellen" target="_blank">Anleitungen auf YouTube</a> an.
        </template>
        <template #slot3>
          Kleinanzeigen.de, nebenan.de, Instagram, Facebook oder TikTok – Es gibt viele kostenlose Plattformen, auf denen Sie aktiv werben und Kunden gewinnen können.
          Nutzen Sie diese Kanäle und kommen Sie mit Ihrer Zielgruppe in Kontakt.
        </template>
        <template #slot4>
          Bitten Sie Kunden, Ihr <a class="text-sky-500" href="https://support.google.com/business/answer/3474122?hl=de" target="_blank">Unternehmen auf Google zu bewerten</a> oder Ihnen auf Facebook und Co. zu folgen oder auf "Gefällt mir" zu klicken.
          Interagieren Sie mit Ihren Kunden, beantworten Sie Fragen und Kommentare und klären Sie kritische Rezensionen.
          Sowohl für Ihre Kunden als auch für Google und Co. ist es außerdem relevant, von wo aus auf Ihre Website verlinkt wird.
          Fragen Sie Kooperationspartner, ob Sie auf deren Websites oder Social Media Profilen verlinkt werden können.
        </template>
        <template #slot5>
          Smartphones machen heutzutage gute Fotos und können diese auch gleich bearbeiten und optimieren.
          Achten Sie ein wenig auf gute Beleuchtung und gut sichtbare Motive und sparen Sie sich den teuren Fotografen, erstmal zumindest.
          Es spricht auch nichts gegen ein Video, wenn Sie sich damit wohlfühlen. Zeigen Sie sich und Ihre Arbeit!
        </template>
      </UAccordion>
  
      <p class="mt-10 text-gray-500 text-lg sm:text-xl">
        Das alles ist kostenlos und wenn Sie sich selbst nicht so sicher am Computer und im Internet fühlen, ist das mit ein bisschen Hilfe aus dem Familien- und Freundeskreis machbar.
        Kommen Sie gerne auf uns zurück, wenn Sie nicht mehr weiterkommen bzw. wenn Sie bereit sind, den nächsten Schritt zu gehen.
        Denn ohne diese Vorbereitung bringt Ihnen auch die beste Website nicht viel.
      </p>

      <h2 class="text-3xl font-bold mt-24">
        Schritt 2: Herausstechen
      </h2>

      <p class="mt-10 text-gray-500 text-lg sm:text-xl">
        Das geht mit einer eigenen Website sehr gut und auch hier gibt es zahlreiche Möglichkeiten, die nicht viel kosten müssen.
        Mit Baukastensystemen wie <a href="https://www.wix.com" target="_blank" class="text-sky-500">Wix</a>, <a href="https://www.jimdo.com" target="_blank" class="text-sky-500">Jimdo</a>, <a href="https://www.squarespace.com" target="_blank" class="text-sky-500">Squarespace</a> oder <a href="https://www.wordpress.com" target="_blank" class="text-sky-500">WordPress</a> können Sie aus vorhandenen Vorlagen eine Website erstellen.
        Da Sie an Google ohnehin nicht vorbeikommen, bietet sich auch <a href="https://sites.google.com" target="_blank" class="text-sky-500">Google Sites</a> an, das Sie kostenlos nutzen können.
      </p>

      <p class="mt-10 text-gray-500 text-lg sm:text-xl">
        All diese Anbieter werden in naher Zukunft auch eine vollständig KI-basierte Erstellung von Websites anbieten oder tun es bereits.
        Das heißt, Sie unterhalten sich mit Ihrem Computer oder Smartphone, wie mit einem Agenturmitarbeiter und der Rest geht von alleine.
        Ganz da sind wir noch nicht, aber es ist nur eine Frage der Zeit. Fragen Sie doch mal <a href="https://chat.openai.com/" target="_blank" class="text-sky-500">ChatGPT</a> oder <a href="https://claude.ai/" target="_blank" class="text-sky-500">Claude</a>, ob es Ihnen eine Website erstellen kann.
        Sie werden erstaunt sein.
      </p>

      <p class="my-10 text-gray-500 text-xl">
        Aber egal welchen Weg sie wählen, es gibt Aspekte einer Website, die nicht sofort ins Auge fallen und gerne vernachlässigt werden.
      </p>

      <UAccordion
        v-model="acc2active"
        :items="acc2items"
        :ui="{
          root: 'flex flex-col gap-3',
          trigger: 'px-4 hover:bg-gray-50',
          label: 'text-gray-900 text-lg font-bold',
          leadingIcon: 'text-sky-500 size-8',
          content: 'text-gray-500 text-lg pt-4 p-4',
          item: 'border last:border border-gray-200 rounded-lg',
        }"
      >
        <template #leading="{ index }">
          <span
            class="text-sky-500 text-4xl mr-2"
            :class="{
              'opacity-30 grayscale': !acc2ItemsOpened.includes(index.toString()),
            }"
          >✔</span>
        </template>
        <template #slot1>
          Welche Überschrift und Beschreibung wird bei Google und Co. angezeigt?
          Auch Messenger-Dienste wie WhatsApp oder soziale Medien zeigen eine Vorschau, wenn Sie einen Link zu Ihrer Website teilen.
          Achten Sie darauf, dass nicht einfach irgendein zufälliges Bild und ein Platzhaltertext angezeigt wird.
          Ihre Website hat auch ein kleines Icon, das sog. Favicon, das z.B. in Suchergebnissen und Lesezeichen angezeigt wird.
          Bei unzähligen Seiten ist das immernoch das Logo von WordPress und Co., weil vergessen wurde, es auszutauschen.
        </template>
        <template #slot2>
          KI wird zunehmend in Suchmaschinen eingesetzt, um Inhalte zu analysieren und das best mögliche Ergebnis zu liefern.
          Nutzer fragen auch immer häufiger direkt ChatGPT und Co. nach Empfehlungen für Produkte und Dienstleistungen.
          Die KI durchforstet dann das Internet und liefert einen maßgeschneiderten Vorschlag.
          Damit Ihre Website dabei berücksichtigt werden kann, sind einige technische Details zu beachten.
          Es macht also Sinn, die eigene Website daraufhin zu optimieren oder zumindest die grundlegende Zugänglichkeit für KI-Tools zu gewährleisten.
        </template>
        <template #slot3>
          Egal wie und wo Sie Ihre Website erstellen, Ihnen wird versprochen werden, dass sie auf allen Geräten gut aussieht.
          Prüfen Sie das! Der Klassiker sind überdimensionierte Schriftgrößen und unglücklich platzierte Elemente, die das Layout sprengen.
          Das Ergebnis von Baukastensystemen erfordert oft noch einiges an Detailarbeit, damit es wirklich gut aussieht.
          Schauen Sie sich Ihre Website mindestens auf dem Smartphone und einem Desktop-Bildschirm an.
          Und auch wenn das Internet mal etwas langsamer ist, sollte Ihre Website mehr oder weniger sofort sichtbar sein.
        </template>
        <template #slot4>
          Konzentrieren Sie sich auf klare und prägnante Angebotsseiten (sog. Landingpage), die alle wichtigen Informationen enthalten,
          die potentielle Kunden benötigen, um eine Entscheidung zu treffen.
          Das heißt nicht, dass Sie sämtliche Persönlichkeit weglassen sollen.
          Vor allem nicht, wenn Sie genau das von anderen abhebt.
          Ein kurzer "Über Mich" Abschnitt kann auch auf mehreren Seiten auftauchen, wenn es für den Lese- und Entscheidungsfluss sinnvoll ist.
          Vermeiden Sie es nur, eine Unterseite nach der anderen zu erstellen, weil Ihnen dieses oder jenes noch einfällt.
        </template>
        <template #slot5>
          Ruinieren Sie sich nicht selbst Ihre Website, indem Sie eine Cookie-Einwilligung einbauen oder einbauen lassen.
          Das nervt die Besucher und sorgt für längere Ladezeiten und frühzeitige Absprünge potenzieller Kunden.
          Sie brauchen keine Cookie-Einwilligung, wenn Sie keine Cookies verwenden, die personenbezogene Daten speichern.
          Und die verwenden Sie nicht, solange Sie keine Analyse-Tools wie Google Analytics nutzen, die für Ihre Zwecke völlig überdimensioniert sind.
          Diese Tools brauchen Sie nur, wenn Sie die Umsätze durch Ihre Website bis auf den letzten Klick genau optimieren wollen.
          Es reicht auch erstmal ein einfacher Aufrufzähler.
        </template>
        <template #slot6>
          Eine Website braucht eine Domain, also das, was Sie in die Adresszeile des Browsers eingeben, z.B. gewerbeprofil.de.
          Unter einer solchen Domain können dann auch E-Mail-Adressen eingerichtet werden, z.B. info@gewerbeprofil.de.
          Das wirkt professioneller als @gmail.com oder @web.de. Wenn Sie die allerdings bereits auf 500 Visitenkarten gedruckt haben, dann ist das auch völlig okay.
          Zumal eine E-Mail-Adresse unter eigener Domain dann definitiv mit Kosten verbunden ist.
          Für eine Domain mit .de am Ende sollten Sie nicht mehr als 10 Euro pro Jahr bezahlen.
          Für die dazugehörige E-Mail-Adresse kommen dann nochmal ca. 0,50 bis 2 oder 3 Euro pro Monat dazu, je nach Anbieter und Speicherplatz.
          Letztlich wollen wir an dieser Stelle nur betonen: Entscheidend für Ihren Erfolg ist beides nicht.
          Konzentrieren Sie sich erstmal auf Ihre Inhalte.
        </template>
        <template #slot7>
          Da Sie gewerblich tätig sind, ist ein Impressum Pflicht und auch um eine Datenschutzerklärung kommen Sie nicht herum.
          Für beides gibt es online <a class="text-sky-500" href="https://www.e-recht24.de/impressum-generator.html" target="_blank">Generatoren</a>, die Ihnen helfen, diese Inhalte zu erstellen.
          Leider liegt der Teufel hier im Detail. So muss z.B. die Datenschutzerklärung aktualisiert werden, wenn Sie bestimmte Inhalte auf Ihrer Website einbinden.
          Sogar die verwendete Schriftart kann Auswirkungen haben, wenn Sie technisch nicht korrekt implementiert ist.
          Viele nutzen daher vorgefertigte Lösungen, die dann haufenweise Paragraphen enthalten, die sie gar nicht betreffen und dazu führen, dass es wirklich niemand mehr liest, außer den Abmahnanwälten.
          Dabei sollte eine Datenschutzerklärung eigentlich einen Zweck erfüllen: Vertrauen schaffen. Lesen Sie doch mal <a class="text-sky-500" href="/datenschutz" target="_blank">unsere</a>.
        </template>
      </UAccordion>

      <p class="mt-10 text-gray-500 text-lg sm:text-xl">
        Diese Liste ist nicht vollständig. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>

      <h2 class="text-2xl sm:text-3xl font-bold mt-24">
        Dürfen wir Ihnen ein Angebot machen?
      </h2>

      <p class="mt-10 text-gray-500 text-lg sm:text-xl">
        Unser <strong class="text-gray-700">Gewerbeprofil</strong> ist eine einfache aber technisch, optisch und rechtlich einwandfreie Website,
        die Sie schnell eingerichtet haben, ohne dabei technisch etwas falsch machen zu können.
      </p>

      <p class="mt-10 text-gray-500 text-lg sm:text-xl">
        Die Struktur ist weitestgehend vorgegeben und optische Anpassungsmöglichkeiten sind begrenzt.
        Aber Sie sind online, mit einer Website, die mehr ist und noch werden kann, als ein Social Media Profil.
        Sie ist Ihr zentraler Anlaufpunkt im Internet, auf dem Sie mit Bild und Text Ihr Unternehmen vorstellen und Anfragen entgegennehmen und auf Ihre weiteren Profile auf anderen Plattformen verweisen können.
      </p>

      <p class="mt-10 text-gray-500 text-lg sm:text-xl">
        Von diesem Punkt aus können Sie Ihre Website dann weiter ausbauen - mit unserer Expertise und Unterstützung.
        Die "Basisausstattung" ist <strong class="text-gray-700">kostenlos</strong>. Ihr Profil wird unter einer Subdomain erreichbar sein, z.B. musterfirma.gewerbeprofil.de und sie nutzen weiterhin Ihre vorhandene @gmail.com E-Mail-Adresse.
      </p>

      <p class="mt-10 text-gray-500 text-lg sm:text-xl">
        Für <strong class="text-gray-700">15 €</strong> im Monat können Sie Ihre eigene Domain einrichten, z.B. musterfirma.de und bekommen eine E-Mail-Adresse unter dieser Domain, z.B. info@musterfirma.de.
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

    <div class="flex gap-6 py-24 justify-center text-sm text-gray-400">
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
