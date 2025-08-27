<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import ColorMode from './ColorMode.vue'

const appConfig = useAppConfig()
const { public: { appHost } } = useRuntimeConfig()
const { user } = useUserSession()

const companyContext = ref('')

const { colorMode, toggleColorMode } = useColorMode()

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
  {
    label: 'Rechtliches: Impressum und Datenschutzerklärung',
    slot: 'slot6',
  },
])
const acc1active = ref<string | undefined>(undefined)
const acc1ItemsOpened = ref<string[]>([])
watch(acc1active, (newVal) => {
  if (newVal) {
    if (!acc1ItemsOpened.value.includes(newVal)) {
      acc1ItemsOpened.value.push(newVal)
    }
  }
})

appConfig.ui.colors.primary = 'sky'
</script>

<template>
  <ColorMode class="font-poppins text-[16px]/[1.6] bg-slate-50 text-slate-900 dark:bg-[#0b1020] dark:text-[#e7ecf4]">
    <header class="sticky top-0 z-50 backdrop-saturate-150 backdrop-blur bg-[linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.65)_60%,rgba(255,255,255,0))] dark:bg-[linear-gradient(180deg,rgba(11,16,32,.9),rgba(11,16,32,.75)_60%,rgba(11,16,32,0))]">
      <div class="mx-auto w-[92vw] max-w-[1200px] flex items-center justify-between py-[14px]">
        <SolohostLogo />
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="opacity-50 hover:opacity-100 inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-[12px] font-semibold tracking-[.2px] text-slate-900 transition duration-200 dark:text-[#e7ecf4]"
            aria-label="Farbschema wechseln"
            :title="colorMode === 'dark' ? 'Tagmodus' : 'Nachtmodus'"
            @click="toggleColorMode"
          >
            <UIcon
              v-if="colorMode === 'dark'"
              name="i-heroicons-sun"
              size="20"
            />
            <UIcon
              v-else
              name="i-heroicons-moon"
              size="20"
            />
          </button>
          <a
            class="whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-[12px] font-semibold tracking-[.2px] border border-slate-900/10 bg-white/10 text-slate-900 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md transition duration-200 hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-[#e7ecf4]"
            :href="user ? `https://${user.userName}.${appHost}` : '/login'"
            aria-label="Anmelden"
          >
            <span>
              {{ user ? 'zur Website' : 'Anmelden' }}
            </span>
          </a>
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
        class="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.36),rgba(0,0,0,.36)),radial-gradient(100%_80%_at_20%_20%,rgba(14,165,233,.52),rgba(255,255,255,.2)_75%),linear-gradient(180deg,rgba(2,132,199,.12),rgba(2,132,199,.22))] dark:bg-[radial-gradient(100%_80%_at_20%_20%,rgba(14,165,233,.45),rgba(11,16,32,.85)_55%),linear-gradient(180deg,rgba(11,16,32,.2),rgba(11,16,32,.25))]"
        aria-hidden="true"
      />
      <div class="relative z-[1] p-[clamp(28px,5vw,64px)] pb-0 grid gap-[22px] max-w-[900px] text-white dark:text-[#e7ecf4]">
        <h1 class="m-0 text-[clamp(28px,4vw,52px)] leading-[1.1] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_forwards]">
          Ihr <span class="font-semibold text-sky-400 text-shadow-sky-950/20 text-shadow-md sm:text-shadow-lg">IT-Experte</span> für den Start in die Solo-Selbstständigkeit.
        </h1>
        <p class="m-0 text-[clamp(16px,2.1vw,20px)] text-white/90 dark:text-[#b3bfd1] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.1s_forwards]">
          Wir begleiten Einzelunternehmer Schritt für Schritt – von der Starthilfe am Computer über die erste Sichtbarkeit im Netz bis zur eigenen Website mit Domain und E-Mail-Postfächern. Verständlich und mit Blick auf das, was sich wirklich für Sie lohnt.
        </p>
        <div class="flex flex-wrap gap-3 mt-2">
          <a
            class="w-full sm:w-auto inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] bg-sky-500/80 hover:bg-sky-500 border border-sky-300/40 text-white transition duration-200 opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.5s_forwards]"
            :href="user ? `https://${user.userName}.${appHost}` : '/register'"
          >
            <UIcon
              name="i-heroicons-computer-desktop"
              size="20"
            />
            Website erstellen
          </a>
          <a
            class="w-full sm:w-auto inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] border border-white/20 bg-white/10 text-white backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md transition duration-200 hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-[#e7ecf4] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.6s_forwards]"
            href="/support"
          >
            <UIcon
              name="i-lucide-headset"
              size="20"
            />
            IT-Support
          </a>
        </div>
      </div>
      <div class="flex md:flex-row flex-col gap-x-[24px] mt-[26px] relative z-[1] p-[clamp(28px,5vw,64px)] pt-0">
        <div class="inline-flex items-center gap-2 py-1 rounded-[12px] font-semibold tracking-[.2px] text-white dark:border-white/10 dark:text-[#e7ecf4] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.6s_forwards]">
          <UIcon
            name="i-heroicons-hand-thumb-up"
            size="20"
          />
          <strong>Einfach zu bedienen</strong>
        </div>
        <div class="inline-flex items-center gap-2 py-1 rounded-[12px] font-semibold tracking-[.2px] text-white dark:border-white/10 dark:text-[#e7ecf4] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.7s_forwards]">
          <UIcon
            name="i-heroicons-rocket-launch"
            size="20"
          />
          <strong>Sofort online</strong>
        </div>
        <div class="inline-flex items-center gap-2 py-1 rounded-[12px] font-semibold tracking-[.2px] text-white dark:border-white/10 dark:text-[#e7ecf4] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.8s_forwards]">
          <UIcon
            name="i-heroicons-sparkles"
            size="20"
          />
          <strong>Modernes Design</strong>
        </div>
      </div>
    </div>

    <section class="mx-auto w-[92vw] max-w-[1200px] pb-16 pt-24">
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-6">
        Was Sie bekommen
      </h2>
      <div class="grid md:grid-cols-3 grid-cols-1 gap-[18px]">
        <div class="rounded-[16px] p-[18px] pb-4 border bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <h3 class="flex items-center gap-2 mb-3 text-[1.05rem]">
            <UIcon
              name="i-heroicons-computer-desktop"
              class="text-sky-600 size-6"
            />
            Professionelle Website
          </h3>
          <p class="text-slate-600 dark:text-[#b3bfd1] m-0">
            Technisch sauber und wirklich einfach zu bedienen. Beinhaltet alles, was einen guten ersten und zweiten Eindruck ausmacht, auch in Suchmaschinen &amp; Social Media.
          </p>
        </div>
        <div class="rounded-[16px] p-[18px] pb-4 border bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <h3 class="flex items-center gap-2 mb-3 text-[1.05rem]">
            <UIcon
              name="i-lucide-at-sign"
              class="text-sky-600 size-6"
            />
            Domain und E-Mail
          </h3>
          <p class="text-slate-600 dark:text-[#b3bfd1] m-0">
            Registrieren Sie Ihre Wunsch-Domain und legen Sie bis zu 3 professionelle E-Mail-Adressen an. Beim Einrichten Ihres E-Mail-Programms helfen wir gerne persönlich.
          </p>
        </div>
        <div class="rounded-[16px] p-[18px] pb-4 border bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <h3 class="flex items-center gap-2 mb-3 text-[1.05rem]">
            <UIcon
              name="i-lucide-headset"
              class="text-sky-600 size-6"
            />
            IT-Support
          </h3>
          <p class="text-slate-600 dark:text-[#b3bfd1] m-0">
            Wir stehen Ihnen persönlich zur Seite und unterstützen Sie bei technischen Fragen,
            per Live-Chat, am Telefon oder per Fernwartung, direkt auf Ihrem Bildschirm.
          </p>
        </div>
      </div>
      <div class="grid md:grid-cols-2 grid-cols-1 gap-[18px] mt-[18px]">
        <div class="md:col-span-2 border rounded-[16px] p-[22px] bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <span class="inline-block px-2 py-[.25rem] rounded-full text-[.8rem] bg-white border border-black/15 text-slate-600 dark:bg-white/10 dark:border-white/15 dark:text-[#b3bfd1]">Starter</span>
          <div class="flex items-end gap-1 mt-3 mb-3">
            <span class="text-[38px] font-extrabold leading-none">Kostenlos</span>
          </div>
          <p class="text-slate-600 dark:text-[#b3bfd1] mb-6">
            Unsere Website-App ist kostenlos und deckt das Nötigste ab – nur eine Domain müssen Sie selber mitbringen.
            Für mehr Funktionen, Gestaltungsmöglichkeiten und regelmäßigen IT-Support bieten wir zwei Premium-Pakete an.
            Zwischen allen drei Varianten können Sie jederzeit wechseln.
          </p>
          <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
            <ul class="list-none p-0 m-0 grid gap-2">
              <li class="flex gap-2 items-start">
                <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Standard-Website, visuell ansprechend
              </li>
              <li class="flex gap-2 items-start">
                <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Kontaktformular, Impressum &amp; Datenschutzerklärung
              </li>
              <li class="flex gap-2 items-start">
                <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Suchmaschinen-Basics &amp; Mobil-Optimierung
              </li>
            </ul>
            <ul class="list-none p-0 m-0 grid gap-2">
              <li class="flex gap-2 items-start">
                <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Keine Cookie-Einwilligung nötig
              </li>
              <li class="flex gap-2 items-start">
                <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Leicht zu bedienen und sofort online
              </li>
              <li class="flex gap-2 items-start">
                <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Nutzbar mit eigener Domain und E-Mail-Adresse
              </li>
            </ul>
          </div>
        </div>
        <div class="border rounded-[16px] p-[22px] bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <span class="inline-block px-2 py-[.25rem] rounded-full bg-sky-500/10 border border-sky-500/15 text-[.8rem] text-sky-500">Premium</span>
          <div class="flex items-end gap-1 mt-3 mb-6">
            <span class="text-[38px] font-extrabold leading-none">17,85 €</span> <span class="text-slate-500 dark:text-[#b3bfd1]">/ Monat inkl. USt.</span>
          </div>
          <ul class="list-none p-0 m-0 mt-3 grid gap-2">
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> .de-Domain &amp; 1 E-Mail-Adresse inklusive
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Mehr Gestaltungsoptionen
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> IT-Support nach Verfügbarkeit, per E-Mail und Live-Chat
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Intelligentes FAQ für bessere Anfragen
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Monatlich kündbar, direkt in der App
            </li>
          </ul>
        </div>
        <div class="border rounded-[16px] p-[22px] bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <span class="inline-block px-2 py-[.25rem] rounded-full bg-sky-500/10 border border-sky-500/15 text-[.8rem] text-sky-500">Premium Plus</span>
          <div class="flex items-end gap-1 mt-3 mb-6">
            <span class="text-[38px] font-extrabold leading-none">59,50 €</span> <span class="text-slate-500 dark:text-[#b3bfd1]">/ Monat inkl. USt.</span>
          </div>
          <ul class="list-none p-0 m-0 mt-3 grid gap-2">
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> .de-Domain &amp; 3 E-Mail-Adressen inklusive
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Individuelle Anpassungen durch uns
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> mindestens 1 Std. IT-Support per Telefon und Fernwartung
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> KI-Assistent für Recherche und Texterstellung
            </li>
            <li class="flex gap-2 items-start">
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> Monatlich kündbar, direkt in der App
            </li>
          </ul>
        </div>
        <div class="md:col-span-2 border rounded-[16px] p-[22px] bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <div class="flex items-end gap-1 mt-3 mb-6">
            <span class="text-[38px] font-extrabold leading-none">Erzählen Sie von sich</span>
          </div>
          <p class="text-slate-600 dark:text-[#b3bfd1] mb-3">
            Wer ist Ihre Zielgruppe und was bieten Sie an? Was macht Sie besonders?
            Erzählen Sie in Stichpunkten oder ganz natürlich per Sprachaufnahme von Ihrem Unternehmen. Seien Sie so ausführlich, wie Sie möchten. Wir bekommen dadurch einen ersten Eindruck und Ihre Website wird gleich mit passenden Inhalten gefüllt.
          </p>
          <textarea
            v-model="companyContext"
            class="w-full resize-none h-[200px] ring-sky-600 focus:ring-3 outline-0 rounded-[12px] p-4 bg-gray-100 dark:bg-[#0b1020] text-slate-900 dark:text-[#e7ecf4]"
          />
          <div class="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <LandingpageRecordAudio @transcript="companyContext = (companyContext || '') + $event" />
            <a
              class="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] bg-sky-500/80 hover:bg-sky-500 border border-sky-300/40 text-white transition duration-200"
              :href="user ? `https://${user.userName}.${appHost}` : `/register?context=${encodeURIComponent(companyContext)}`"
            >
              Kostenlose Website erstellen
              <UIcon
                name="i-heroicons-arrow-right"
                class="ml-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto w-[92vw] max-w-[1200px] py-16">
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-6">
        So werden Sie sichtbar
      </h2>
      <UAccordion
        v-model="acc1active"
        :items="acc1items"
        :unmount-on-hide="false"
        :ui="{
          root: 'flex flex-col gap-3',
          item: 'rounded-[16px] border !border-b bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10',
          trigger: 'px-4 py-3 rounded-[12px] hover:bg-black/5 text-slate-900 transition-colors dark:hover:bg-white/5 dark:text-[#e7ecf4]',
          label: 'text-[1.05rem] font-semibold',
          leadingIcon: 'text-sky-500 size-8',
          content: 'text-slate-600 dark:text-[#b3bfd1] text-base sm:text-lg',
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
          <div class="p-4">
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
            >Google Gemini</a> (oder der Solohost Assistent) können Ihnen helfen,
            Klarheit zu gewinnen und professionelle Texte zu schreiben, z.B. für Kleinanzeigen oder Social Media Posts. Auch bei rechtlichen und steuerlichen Fragen können diese Tools eine gute erste Orientierung geben.
            Den Steuerberater können sie aktuell aber noch nicht ersetzen.
          </div>
        </template>
        <template #slot2>
          <div class="p-4">
            Werden Sie gefunden. Das ist ebenfalls kostenlos und wesentlich wichtiger, als eine Website, die ansonsten ohnehin kaum jemand findet, gerade am Anfang.
            Legen Sie sich ein <a
              class="text-sky-500"
              href="https://accounts.google.com/signup"
              target="_blank"
            >Google-Konto</a> an (falls Sie noch keins haben) und schauen Sie sich eine der zahlreichen <a
              class="text-sky-500"
              href="https://www.youtube.com/results?search_query=google+unternehmensprofil+erstellen"
              target="_blank"
            >Anleitungen auf YouTube</a> an. Ein paar Klicks und fertig. Vielleicht kommt noch ein Freischaltcode per Post, den Sie bei Google eingeben müssen. Das Wichtigste ist damit aber erstmal geschafft.
          </div>
        </template>
        <template #slot3>
          <div class="p-4">
            Kleinanzeigen.de, nebenan.de, Instagram, Facebook oder TikTok – Es gibt viele kostenlose Plattformen, auf denen Sie aktiv werben und Kunden gewinnen können.
            Nutzen Sie diese Kanäle und kommen Sie mit Ihrer Zielgruppe in Kontakt.
          </div>
        </template>
        <template #slot4>
          <div class="p-4">
            Bitten Sie Kunden, Ihr <a
              class="text-sky-500"
              href="https://support.google.com/business/answer/3474122?hl=de"
              target="_blank"
            >Unternehmen auf Google zu bewerten</a> oder Ihnen auf Facebook und Co. zu folgen oder auf "Gefällt mir" zu klicken.
            Interagieren Sie mit Ihren Kunden, beantworten Sie Fragen und Kommentare und klären Sie kritische Rezensionen.
            Sowohl für Ihre Kunden als auch für Google und Co. ist es außerdem relevant, von wo aus auf Ihre Website verlinkt wird.
            Fragen Sie Kooperationspartner, ob Sie auf deren Websites oder Social Media Profilen verlinkt werden können.
          </div>
        </template>
        <template #slot5>
          <div class="p-4">
            Smartphones machen heutzutage gute Fotos und können diese auch gleich bearbeiten und optimieren.
            Achten Sie ein wenig auf gute Beleuchtung und gut sichtbare Motive und sparen Sie sich den teuren Fotografen, erstmal zumindest.
            Es spricht auch nichts gegen ein Video, wenn Sie sich damit wohlfühlen. Zeigen Sie sich und Ihre Arbeit!
          </div>
        </template>
        <template #slot6>
          <div class="p-4">
            Da Sie gewerblich tätig sind, ist ein Impressum auf der Website Pflicht und auch um eine Datenschutzerklärung kommen Sie nicht herum.
            Für beides gibt es online <a
              class="text-sky-500"
              href="https://www.e-recht24.de/impressum-generator.html"
              target="_blank"
            >Generatoren</a>.
            Leider liegt der Teufel hier im Detail - wer hätte das gedacht?
            Sie können nicht einfach ein YouTube-Video auf Ihrer Website anzeigen, ohne den Besucher um Erlaubnis zu bitten.
            Haben Sie ein Kontaktformular? Was passiert mit den Daten, die dort eingegeben werden?
            Sogar die verwendete Schriftart oder eingefügte Bilder können Auswirkungen haben, wenn Sie technisch nicht korrekt implementiert sind.
            Viele nutzen daher vorgefertigte Lösungen, die dann haufenweise Paragraphen enthalten, die sie gar nicht betreffen und dazu führen, dass es wirklich niemand mehr liest, außer den Abmahnanwälten.
            Dabei sollte eine Datenschutzerklärung eigentlich einen Zweck erfüllen: Vertrauen schaffen. Lesen Sie doch mal <a
              class="text-sky-500"
              href="/datenschutz"
              target="_blank"
            >unsere</a>.
          </div>
        </template>
      </UAccordion>
    </section>

    <footer class="py-[38px] pb-[58px] text-slate-600 dark:text-[#b3bfd1]">
      <div class="mx-auto w-[92vw] max-w-[1200px] flex flex-wrap gap-5 justify-between items-center">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-[13px] bg-[radial-gradient(100%_100%_at_30%_20%,#58d0ff_0%,#0ea5e9_40%,#04669e_100%)] grid place-items-center"
            aria-hidden="true"
          >
            <div
              class="w-10 h-10 font-bold text-2xl rounded-[13px] text-white bg-[radial-gradient(100%_100%_at_30%_20%,#58d0ff_0%,#0ea5e9_40%,#04669e_100%)] grid place-items-center shadow-[0_10px_18px_rgba(14,165,233,.35)]"
              aria-hidden="true"
            >
              S
            </div>
          </div>
          <div>
            <strong class="text-slate-900 dark:text-white text-lg">Solohost</strong><br>
            Webhosting &amp; IT‑Beratung · <a
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
  </ColorMode>
</template>

<!-- No scoped CSS: Tailwind dark utilities handle theming -->
