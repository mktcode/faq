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
    label: 'Weniger ist mehr: Klare Angebote statt zu vieler Unterseiten',
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
    class="font-poppins bg-[#0b1020] text-[#e7ecf4] text-[16px]/[1.6]"
  >
    <header class="sticky top-0 z-50 bg-[linear-gradient(180deg,rgba(11,16,32,.9),rgba(11,16,32,.75)_60%,rgba(11,16,32,0))] backdrop-saturate-150 backdrop-blur">
      <div class="mx-auto w-[92vw] max-w-[1200px] flex items-center justify-between py-[14px]">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-[13px] bg-[radial-gradient(100%_100%_at_30%_20%,#58d0ff_0%,#0ea5e9_40%,#04669e_100%)] grid place-items-center shadow-[0_10px_18px_rgba(14,165,233,.35)]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-6 h-6 fill-white"
              aria-hidden="true"
            ><path d="M16.7 7.6c0-2.2-1.9-3.8-4.5-3.8-2.3 0-4.5 1.1-5.9 2.8-.5.6-.5 1.5.1 2.1s1.6.5 2.1-.1c.9-1.1 2.3-1.8 3.7-1.8 1.3 0 2.2.6 2.2 1.5 0 1.2-1.5 1.7-3.4 2.1-2.7.6-5.8 1.3-5.8 4.6 0 2.5 2.3 4.3 5.4 4.3 2.1 0 4.1-.8 5.5-2.2.6-.6.6-1.5 0-2.1-.6-.6-1.5-.6-2.1 0-1 .9-2.2 1.4-3.4 1.4-1.3 0-2.3-.6-2.3-1.5 0-1.4 1.9-1.8 4-2.2 2.5-.6 5.2-1.2 5.2-4.9Z" /></svg>
          </div>
          <span class="font-extrabold tracking-[.2px]">Solihost</span>
          <span class="inline-block px-2 py-[.25rem] rounded-full bg-white/10 border border-white/15 text-[.8rem] text-[#b3bfd1]">beta</span>
        </div>
        <div class="flex items-center gap-2">
          <a
            class="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] border border-white/10 bg-white/5 text-[#e7ecf4]"
            href="tel:+4917670864627"
            aria-label="Anrufen"
          >📞 Beratung: 0176 70 86 46 27</a>
          <a
            class="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] border border-transparent bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] text-white shadow-[0_6px_18px_rgba(14,165,233,.35)] transition duration-200 hover:-translate-y-px"
            :href="me ? `https://${me.userName}.${appHost}` : '/register'"
          >Kostenlose Website erstellen</a>
        </div>
      </div>
    </header>

    <div
      class="mx-auto w-[92vw] max-w-[1200px] relative rounded-[22px] overflow-hidden mt-[14px]"
      aria-label="Intro"
    >
      <video
        id="heroVideo"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        poster=""
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/header.mp4"
          type="video/mp4"
        >
      </video>
      <div
        class="absolute inset-0 bg-[radial-gradient(100%_80%_at_20%_20%,rgba(14,165,233,.45),rgba(11,16,32,.85)_55%),linear-gradient(180deg,rgba(11,16,32,.2),rgba(11,16,32,.85))]"
        aria-hidden="true"
      />
      <div class="relative z-[1] p-[clamp(28px,5vw,64px)] pb-0 grid gap-[22px] max-w-[900px]">
        <h1 class="m-0 text-[clamp(28px,4vw,52px)] leading-[1.1]">
          Ihr professioneller Auftritt – <span class="text-[#0ea5e9]">klar, rechtssicher</span> und ohne Overkill.
        </h1>
        <p class="m-0 text-[clamp(16px,2.1vw,20px)] text-[#b3bfd1]">
          Wir begleiten Freiberufler &amp; Einzelunternehmer Schritt für Schritt – von der Einrichtung der Buchhaltung über die erste Sichtbarkeit im Netz bis zur eigenen Website mit Domain und E-Mail-Postfächern. Verständlich, fokussiert und mit Blick auf das, was sich wirklich für Sie lohnt.
        </p>
        <div class="flex flex-wrap gap-3 mt-2">
          <a
            class="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] border border-transparent bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] text-white shadow-[0_6px_18px_rgba(14,165,233,.35)] transition duration-200 hover:-translate-y-px"
            :href="me ? `https://${me.userName}.${appHost}` : '/register'"
          >Kostenlose Website erstellen</a>
          <a
            class="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] border border-white/10 bg-white/5 text-[#e7ecf4]"
            href="tel:+4917670864627"
          >Erstberatung am Telefon</a>
        </div>
      </div>
      <div class="grid md:grid-cols-3 grid-cols-1 gap-[14px] my-[26px] mb-[10px] relative z-[1] p-[clamp(28px,5vw,64px)] pt-0">
        <div class="bg-[#0f162e] border border-white/10 rounded-[14px] px-[14px] py-[12px] flex items-center gap-[10px]">
          ✅ <strong>Cookie‑frei</strong> &amp; DSGVO‑sauber
        </div>
        <div class="bg-[#0f162e] border border-white/10 rounded-[14px] px-[14px] py-[12px] flex items-center gap-[10px]">
          ⚡ <strong>Schnell</strong> &amp; mobil optimiert
        </div>
        <div class="bg-[#0f162e] border border-white/10 rounded-[14px] px-[14px] py-[12px] flex items-center gap-[10px]">
          🔎 <strong>SEO‑ &amp; KI‑ready</strong>
        </div>
      </div>
    </div>

    <section class="mx-auto w-[92vw] max-w-[1200px] py-16">
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-3">
        So kommen Sie schnell zu Ergebnissen
      </h2>
      <p class="text-[#b3bfd1] mb-7">
        Pragmatisch statt umständlich: Wir starten schlank und verbessern gezielt, wenn sich zeigt, was wirkt.
      </p>
      <div class="grid md:grid-cols-3 grid-cols-1 gap-[18px] [counter-reset:step]">
        <div class="bg-[#0f162e] border border-white/10 rounded-[16px] p-[18px]">
          <h3 class="m-0 mb-2 before:content-[counter(step)] before:[counter-increment:step] before:inline-grid before:place-items-center before:w-[28px] before:h-[28px] before:mr-[10px] before:rounded-[8px] before:bg-[rgba(14,165,233,.25)] before:text-[#e6f7ff] before:font-bold flex items-center">
            Klarheit schaffen
          </h3>
          <p>Ihr Angebot auf den Punkt: Zielgruppe, Nutzenversprechen, nächste Aktion. Wir helfen bei Texten – auf Wunsch mit KI‑Unterstützung.</p>
        </div>
        <div class="bg-[#0f162e] border border-white/10 rounded-[16px] p-[18px]">
          <h3 class="m-0 mb-2 before:content-[counter(step)] before:[counter-increment:step] before:inline-grid before:place-items-center before:w-[28px] before:h-[28px] before:mr-[10px] before:rounded-[8px] before:bg-[rgba(14,165,233,.25)] before:text-[#e6f7ff] before:font-bold flex items-center">
            Sichtbar werden
          </h3>
          <p>Google Unternehmensprofil, Social‑Kanäle, Bewertungen – wir richten die Basics ein und verknüpfen alles sauber.</p>
        </div>
        <div class="bg-[#0f162e] border border-white/10 rounded-[16px] p-[18px]">
          <h3 class="m-0 mb-2 before:content-[counter(step)] before:[counter-increment:step] before:inline-grid before:place-items-center before:w-[28px] before:h-[28px] before:mr-[10px] before:rounded-[8px] before:bg-[rgba(14,165,233,.25)] before:text-[#e6f7ff] before:font-bold flex items-center">
            Website launchen
          </h3>
          <p>Technisch sauber, mobil schnell, rechtssicher. Ihr Auftritt wird zur zentralen Anlaufstelle für Links, Buchung &amp; Kontakt.</p>
        </div>
      </div>
    </section>

    <section class="mx-auto w-[92vw] max-w-[1200px] py-16">
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-3">
        Was Sie bekommen
      </h2>
      <p class="text-[#b3bfd1] mb-7">
        Die Standard‑Website ist kostenlos – und deckt die wichtigsten Grundlagen ab. Im Abo können wir jederzeit ausbauen.
      </p>
      <div class="grid md:grid-cols-3 grid-cols-1 gap-[18px]">
        <div class="bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] border border-white/10 rounded-[16px] p-[18px] pb-4">
          <h3 class="flex items-center gap-2 mb-1 text-[1.05rem]">
            <span class="inline-block w-[18px] h-[18px]">🔧</span>Technisch sauber
          </h3>
          <p class="text-[#b3bfd1] m-0">
            Sauberer Code, saubere Metadaten, korrekte Vorschaubilder – alles, was einen guten ersten Eindruck in Suchmaschinen &amp; Social Media ausmacht.
          </p>
        </div>
        <div class="bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] border border-white/10 rounded-[16px] p-[18px] pb-4">
          <h3 class="flex items-center gap-2 mb-1 text-[1.05rem]">
            <span class="inline-block w-[18px] h-[18px]">📜</span>Rechtssicher
          </h3>
          <p class="text-[#b3bfd1] m-0">
            Korrektes Impressum &amp; passgenaue Datenschutzerklärung – basierend auf den tatsächlich genutzten Funktionen.
          </p>
        </div>
        <div class="bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] border border-white/10 rounded-[16px] p-[18px] pb-4">
          <h3 class="flex items-center gap-2 mb-1 text-[1.05rem]">
            <span class="inline-block w-[18px] h-[18px]">📱</span>Mobil &amp; schnell
          </h3>
          <p class="text-[#b3bfd1] m-0">
            Optimiert für Smartphones und große Bildschirme. Fokus auf Ladezeit statt Ballast.
          </p>
        </div>
        <div class="bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] border border-white/10 rounded-[16px] p-[18px] pb-4">
          <h3 class="flex items-center gap-2 mb-1 text-[1.05rem]">
            <span class="inline-block w-[18px] h-[18px]">🧭</span>Geführt statt allein
          </h3>
          <p class="text-[#b3bfd1] m-0">
            Wir beraten Sie bei jedem Schritt – pragmatisch, verständlich und ohne Agentur‑Sprech.
          </p>
        </div>
        <div class="bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] border border-white/10 rounded-[16px] p-[18px] pb-4">
          <h3 class="flex items-center gap-2 mb-1 text-[1.05rem]">
            <span class="inline-block w-[18px] h-[18px]">🔗</span>Alle Links an einem Ort
          </h3>
          <p class="text-[#b3bfd1] m-0">
            Social Media, Anzeigenportale, externe Buchungskalender oder Shops: sauber verknüpft.
          </p>
        </div>
        <div class="bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] border border-white/10 rounded-[16px] p-[18px] pb-4">
          <h3 class="flex items-center gap-2 mb-1 text-[1.05rem]">
            <span class="inline-block w-[18px] h-[18px]">🤖</span>SEO‑ &amp; KI‑ready
          </h3>
          <p class="text-[#b3bfd1] m-0">
            Strukturierte Daten und Zugänglichkeit, damit Suchmaschinen &amp; Assistenten Ihre Infos korrekt verstehen.
          </p>
        </div>
      </div>
    </section>

    <section
      id="preise"
      class="mx-auto w-[92vw] max-w-[1200px] py-16"
    >
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-3">
        Preise
      </h2>
      <p class="text-[#b3bfd1] mb-7">
        Starten Sie kostenlos. Wenn Sie mehr Gestaltungsspielraum wollen, buchen Sie das Abo jederzeit dazu – monatlich kündbar.
      </p>
      <div class="grid md:grid-cols-2 grid-cols-1 gap-[18px]">
        <div class="bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] border border-white/10 rounded-[16px] p-[22px]">
          <span class="inline-block px-2 py-[.25rem] rounded-full bg-white/10 border border-white/15 text-[.8rem] text-[#b3bfd1]">Standard</span>
          <div class="flex items-end gap-1 my-1 mb-3">
            <span class="text-[38px] font-extrabold">0 €</span> <span class="text-[#b3bfd1]">einmalig</span>
          </div>
          <ul class="list-none p-0 m-0 mt-3 grid gap-2">
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Standard‑Website, visuell ansprechend
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Impressum &amp; Datenschutzerklärung passend zu Funktionen
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Cookie‑frei (solange keine externen Tracker)
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> SEO/KI‑Basics &amp; Mobil‑Optimierung
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Verlinkung aller relevanten Profile &amp; Tools
            </li>
          </ul>
        </div>
        <div class="bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] border border-white/10 rounded-[16px] p-[22px]">
          <span class="inline-block px-2 py-[.25rem] rounded-full bg-white/10 border border-white/15 text-[.8rem] text-[#b3bfd1]">Abo</span>
          <div class="flex items-end gap-1 my-1 mb-3">
            <span class="text-[38px] font-extrabold">17,85 €</span> <span class="text-[#b3bfd1]">/ Monat inkl. MwSt.</span>
          </div>
          <ul class="list-none p-0 m-0 mt-3 grid gap-2">
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Mehr Gestaltung &amp; individuelle Anpassungen durch uns
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Integrierter Buchungskalender &amp; einfache Shop‑Funktion
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Intelligentes FAQ für bessere Anfragen
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Mehr Speicher für Medien &amp; Dateien
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> .de‑Domain &amp; E‑Mail‑Adresse inklusive
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-[rgba(22,163,74,.2)] grid place-items-center mt-[2px]">✓</span> Monatlich kündbar, per Klick
            </li>
          </ul>
        </div>
      </div>
      <div
        id="cta"
        class="flex flex-wrap gap-3 mt-[18px]"
      >
        <a
          class="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] border border-transparent bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] text-white shadow-[0_6px_18px_rgba(14,165,233,.35)] transition duration-200 hover:-translate-y-px"
          :href="me ? `https://${me.userName}.${appHost}` : '/register'"
        >Kostenlose Website erstellen</a>
        <a
          class="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] border border-white/10 bg-white/5 text-[#e7ecf4]"
          href="mailto:info@solihost.de"
        >Fragen? Schreiben Sie uns</a>
      </div>
    </section>

    <section class="mx-auto w-[92vw] max-w-[1200px] py-16">
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-3">
        Leitfaden für Anfänger
      </h2>
      <UAccordion
        v-model="acc1active"
        :items="acc1items"
        :unmount-on-hide="false"
        :ui="{
          root: 'flex flex-col gap-3',
          trigger: 'px-4 hover:bg-gray-50',
          label: 'text-base sm:text-lg font-bold',
          leadingIcon: 'text-sky-500 size-8',
          content: 'text-base sm:text-lg pt-4 p-4',
          item: 'border last:border border-gray-200 rounded-lg',
        }"
      >
        <template #leading="{ index }">
          <span
            class="text-sky-500 text-3xl sm:text-4xl"
            :class="{
              'opacity-30 grayscale': !acc1ItemsOpened.includes(index.toString()),
            }"
          >✔</span>
        </template>
        <template #slot1>
          Beim heutigen Konsumverhalten hilft es, wenn Sie in Überschriftenlänge oder maximal zwei bis drei kurzen Sätzen erklären können, was Sie anbieten, für wen und welche Vorteile Kunden bei Ihnen haben.
          Je präziser Ihre Zielgruppe definiert ist, desto gezielter können Sie diese ansprechen.
          Kostenlose KI-Tools wie <a
            class="text-sky-500"
            href="https://chat.openai.com/"
            target="_blank"
          >ChatGPT</a> oder <a
            class="text-sky-500"
            href="https://gemini.google.com"
            target="_blank"
          >Google Gemini</a> können Ihnen helfen,
          Klarheit zu gewinnen und professionelle Texte zu schreiben, z.B. für Kleinanzeigen oder Social Media Posts. Auch bei rechtlichen und steuerlichen Fragen können diese Tools eine gute erste Orientierung geben.
          Lesen Sie unsere <a
            class="text-sky-500"
            href="/"
            target="_blank"
          >Prompt-Anleitung</a> für gute Ergebnisse.
        </template>
        <template #slot2>
          Werden Sie gefunden. Das ist ebenfalls kostenlos und wesentlich wichtiger als eine Website, die ansonsten ohnehin kaum jemand findet, gerade am Anfang.
          Legen Sie sich ein <a
            class="text-sky-500"
            href="https://accounts.google.com/signup"
            target="_blank"
          >Google-Konto</a> an (falls Sie noch keins haben) und schauen Sie sich eine der zahlreichen <a
            class="text-sky-500"
            href="https://www.youtube.com/results?search_query=google+unternehmensprofil+erstellen"
            target="_blank"
          >Anleitungen auf YouTube</a> an.
        </template>
        <template #slot3>
          Kleinanzeigen.de, nebenan.de, Instagram, Facebook oder TikTok – Es gibt viele kostenlose Plattformen, auf denen Sie aktiv werben und Kunden gewinnen können.
          Nutzen Sie diese Kanäle und kommen Sie mit Ihrer Zielgruppe in Kontakt.
        </template>
        <template #slot4>
          Bitten Sie Kunden, Ihr <a
            class="text-sky-500"
            href="https://support.google.com/business/answer/3474122?hl=de"
            target="_blank"
          >Unternehmen auf Google zu bewerten</a> oder Ihnen auf Facebook und Co. zu folgen oder auf "Gefällt mir" zu klicken.
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
      <UAccordion
        v-model="acc2active"
        :items="acc2items"
        :unmount-on-hide="false"
        :ui="{
          root: 'flex flex-col gap-3',
          trigger: 'px-4 hover:bg-gray-50',
          label: 'text-gray-900 text-lg font-bold',
          leadingIcon: 'text-sky-500 size-8',
          content: 'text-gray-500 text-base sm:text-lg pt-4 p-4',
          item: 'border last:border border-gray-200 rounded-lg',
        }"
      >
        <template #leading="{ index }">
          <span
            class="text-sky-500 text-3xl sm:text-4xl"
            :class="{
              'opacity-30 grayscale': !acc2ItemsOpened.includes(index.toString()),
            }"
          >✔</span>
        </template>
        <template #slot1>
          Welche Überschrift und Beschreibung wird bei Google und Co. angezeigt?
          Auch Messenger-Dienste wie WhatsApp oder soziale Medien zeigen eine Vorschau, wenn Sie Ihre Website teilen.
          Achten Sie darauf, dass nicht einfach irgendein zufälliges Bild und ein Platzhaltertext angezeigt wird.
          Eine Website hat auch immer ein kleines Icon, das in Suchergebnissen und Lesezeichen angezeigt wird.
          Bei vielen Seiten ist das immernoch das Logo von WordPress und Co., weil vergessen wurde, es auszutauschen.
          Auch Fehlerseiten, z.B. der berühmte 404-Fehler, sollten in Ihrem Branding erscheinen.
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
          Das Ergebnis von Baukastensystemen erfordert oft noch einiges an Detailarbeit.
          Prüfen Sie Ihre Website mindestens auf dem Smartphone und einem großen Bildschirm.
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
          Ruinieren Sie sich nicht selbst mit einer Cookie-Einwilligung Ihre Website.
          Das nervt die Besucher und sorgt für längere Ladezeiten und frühzeitige Absprünge potenzieller Kunden.
          Sie brauchen keine Cookie-Einwilligung, wenn Sie keine Cookies verwenden, die personenbezogene Daten speichern.
          Und das tun Sie nicht, solange Sie keine Analyse-Tools wie Google Analytics nutzen, die für Ihre Zwecke völlig überdimensioniert sind.
          Diese Tools brauchen Sie nur, wenn Sie die Umsätze durch Ihre Website perfekt optimieren wollen.
          Es reicht auch erstmal ein anonymisierter Aufrufzähler, am besten je nach Quelle, damit Sie sehen, von wo Ihre Besucher kommen.
        </template>
        <template #slot6>
          Eine Website braucht eine Domain, also das, was Sie in die Adresszeile des Browsers eingeben, z.B. meinefirma.de.
          Dann können auch E-Mail-Adressen wie info@meinefirma.de eingerichtet werden.
          Das wirkt professioneller als maxmusterman1988@gmail.com oder @gmx.de.
          Wenn Sie die allerdings bereits auf 500 Visitenkarten gedruckt haben, dann ist das auch völlig in Ordnung.
          Entscheidend ist Ihre Arbeit, nicht Ihre E-Mail-Adresse.
          Sie brauchen sich jedenfalls nicht tagelang Gedanken über die perfekte Premium-Domain zu machen.
          Es reicht eine "normale" .de Domain für maximal 1 € im Monat.
          Eine Domain gibt man ohnehin selten manuell ein, sondern klickt auf eine Anzeige, ein Social Media Profil oder ein Suchergebniss.
        </template>
        <template #slot7>
          Da Sie gewerblich tätig sind, ist ein Impressum Pflicht und auch um eine Datenschutzerklärung kommen Sie nicht herum.
          Für beides gibt es online <a
            class="text-sky-500"
            href="https://www.e-recht24.de/impressum-generator.html"
            target="_blank"
          >Generatoren</a>.
          Leider liegt der Teufel hier im Detail - wer hätte das gedacht?
          Sie können nicht einfach ein YouTube-Video auf Ihrer Website anzeigen, ohne den Besucher um Erlaubnis zu bitten.
          Haben Sie ein Kontaktformular? Was passiert mit den Daten, die dort eingegeben werden?
          Sogar die verwendete Schriftart kann Auswirkungen haben, wenn Sie technisch nicht korrekt implementiert ist.
          Viele nutzen daher vorgefertigte Lösungen, die dann haufenweise Paragraphen enthalten, die sie gar nicht betreffen und dazu führen, dass es wirklich niemand mehr liest, außer den Abmahnanwälten.
          Dabei sollte eine Datenschutzerklärung eigentlich einen Zweck erfüllen: Vertrauen schaffen. Lesen Sie doch mal <a
            class="text-sky-500"
            href="/datenschutz"
            target="_blank"
          >unsere</a>.
        </template>
      </UAccordion>
    </section>

    <footer class="py-[38px] pb-[58px] text-[#b3bfd1]">
      <div class="mx-auto w-[92vw] max-w-[1200px] flex flex-wrap gap-5 justify-between items-center">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-[13px] bg-[radial-gradient(100%_100%_at_30%_20%,#58d0ff_0%,#0ea5e9_40%,#04669e_100%)] grid place-items-center shadow-[0_10px_18px_rgba(14,165,233,.35)]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-6 h-6 fill-white"
            ><path d="M16.7 7.6c0-2.2-1.9-3.8-4.5-3.8-2.3 0-4.5 1.1-5.9 2.8-.5.6-.5 1.5.1 2.1s1.6.5 2.1-.1c.9-1.1 2.3-1.8 3.7-1.8 1.3 0 2.2.6 2.2 1.5 0 1.2-1.5 1.7-3.4 2.1-2.7.6-5.8 1.3-5.8 4.6 0 2.5 2.3 4.3 5.4 4.3 2.1 0 4.1-.8 5.5-2.2.6-.6.6-1.5 0-2.1-.6-.6-1.5-.6-2.1 0-1 .9-2.2 1.4-3.4 1.4-1.3 0-2.3-.6-2.3-1.5 0-1.4 1.9-1.8 4-2.2 2.5-.6 5.2-1.2 5.2-4.9Z" /></svg>
          </div>
          <div>
            <strong class="text-white">Solihost</strong><br>
            IT‑Beratung &amp; Fernwartung · <a
              class="text-[#0ea5e9]"
              href="tel:+4917670864627"
            >0176 70 86 46 27</a>
          </div>
        </div>
        <div class="flex gap-[14px] flex-wrap">
          <a
            class="text-[#0ea5e9]"
            href="https://markus-kottlaender.de/impressum"
            rel="noopener"
            target="_blank"
          >Impressum</a>
          <a
            class="text-[#0ea5e9]"
            href="https://markus-kottlaender.de/datenschutz"
            rel="noopener"
            target="_blank"
          >Datenschutz</a>
          <a
            class="text-[#0ea5e9]"
            href="https://markus-kottlaender.de/agb"
            rel="noopener"
            target="_blank"
          >AGB</a>
        </div>
      </div>
    </footer>
  </div>
</template>
