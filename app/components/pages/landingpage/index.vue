<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const { public: { appHost } } = useRuntimeConfig()
const { user } = useUserSession()

const companyContext = ref('')
const isRecordingAudio = ref(false)

const lexwareLink = 'https://office.lexware.de/preise?pid=nPH1xfzsql&pdata=O4XolHNCc0&cid=1777&utm_medium=affiliate&utm_source=recommend-nPH1xfzsql&utm_campaign=kunden-werben-kunden&couponCode=LXOK4YWK'

const acc1items = ref<AccordionItem[]>([
  {
    label: 'Klarheit schaffen: Ist Ihr Angebot in einem Satz erklärbar? Wer ist Ihre Zielgruppe?',
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
    label: 'Künstliche Intelligenz: Nutzen Sie die neuen Möglichkeiten.',
    slot: 'slot5',
  },
  {
    label: 'Meine Buchhaltungsempfehlung: Lexware Office',
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
  <PagesLandingpageColorMode class="font-poppins text-[16px]/[1.6] bg-slate-50 text-slate-900 dark:bg-[#0b1020] dark:text-[#e7ecf4]">
    <PagesLandingpageHeader />

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
      <div class="relative z-[1] p-[clamp(28px,5vw,64px)] grid gap-[22px] max-w-[900px] text-white dark:text-[#e7ecf4]">
        <h1 class="m-0 text-[clamp(28px,4vw,52px)] leading-[1.1] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_forwards] font-bold">
          Ihr <span class="font-semibold text-sky-400 text-shadow-sky-950/20 text-shadow-md sm:text-shadow-lg">IT-Experte</span> für den Start in die Solo-Selbstständigkeit.
        </h1>
        <p class="m-0 text-[clamp(16px,2.1vw,20px)] text-white/90 dark:text-[#b3bfd1] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.1s_forwards]">
          Ich begleite Einzelunternehmer Schritt für Schritt – von der Starthilfe am Computer über die erste Sichtbarkeit im Netz bis zur eigenen Website mit Domain und E-Mail-Postfächern. Verständlich und mit Blick auf das, was sich wirklich für Sie lohnt.
        </p>
        <div class="flex flex-wrap gap-3 mt-2">
          <a
            class="w-full sm:w-auto inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] bg-sky-500/80 hover:bg-sky-500 text-white transition duration-200 opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.5s_forwards]"
            :href="user ? `https://${user.userName}.${appHost}` : '/register'"
          >
            <UIcon
              name="i-lucide-monitor-smartphone"
              size="20"
            />
            Website erstellen
          </a>
          <a
            class="w-full sm:w-auto inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] border border-white/20 bg-white/10 text-white backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md transition duration-200 hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-[#e7ecf4] opacity-0 motion-safe:animate-[fade-up_0.5s_ease-in-out_0.6s_forwards]"
            :href="user ? `https://${user.userName}.${appHost}#support` : '/register?target=it-support'"
          >
            <UIcon
              name="i-lucide-headset"
              size="20"
            />
            IT-Support
          </a>
        </div>
      </div>
    </div>

    <section class="mx-auto w-[92vw] max-w-[1200px] pb-16 pt-24">
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-6 font-bold">
        Was Sie bekommen
      </h2>
      <div class="grid md:grid-cols-3 grid-cols-1 gap-[18px]">
        <div class="rounded-[16px] p-[18px] pb-4 border bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <h3 class="flex items-center gap-2 mb-3 text-[1.05rem]">
            <UIcon
              name="i-heroicons-computer-desktop"
              class="text-sky-600 size-6"
            />
            Website, Domain und E-Mail
          </h3>
          <p class="text-slate-600 dark:text-[#b3bfd1] m-0">
            Einfach zu bedienen und technisch sauber: Ihr professioneller Auftritt, inkl. Wunsch-Domain, E-Mail-Postfächer, sowie Impressum und Datenschutzerklärung.
          </p>
        </div>
        <div class="rounded-[16px] p-[18px] pb-4 border bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <h3 class="flex items-center gap-2 mb-3 text-[1.05rem]">
            <UIcon
              name="i-lucide-book-open-check"
              class="text-sky-600 size-6"
            />
            Redaktionelle Inhalte
          </h3>
          <p class="text-slate-600 dark:text-[#b3bfd1] m-0">
            Ich helfe bei der Formulierung und laufenden Optimierung Ihrer Inhalte und Werbebotschaften – online wie offline – und Sie sparen sich viel Zeit.
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
            Bei allgemeinen technischen Problemen oder Fragen stehe ich Ihnen per E-Mail, Live-Chat oder Telefon und Fernwartung persönlich zur Seite.
          </p>
        </div>
      </div>
      <div class="grid md:grid-cols-2 grid-cols-1 gap-[18px] mt-[18px]">
        <div class="border rounded-[16px] p-[22px] bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <span class="inline-block px-2 py-[.25rem] rounded-full bg-sky-500/10 border border-sky-500/15 text-[.8rem] text-sky-500">Nur Website</span>
          <div class="flex items-end gap-1 mt-3 mb-6">
            <span class="text-[38px] font-extrabold leading-none">17,85 €</span> <span class="text-slate-500 dark:text-[#b3bfd1]">/ Monat inkl. USt.</span>
          </div>
          <ul class="list-none p-0 m-0 mt-3 grid gap-2">
            <li
              v-for="feature in solohost.features.S"
              :key="feature"
              class="flex gap-2 items-start"
            >
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> {{ feature }}
            </li>
          </ul>
        </div>
        <div class="border rounded-[16px] p-[22px] bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <span class="inline-block px-2 py-[.25rem] rounded-full bg-sky-500/10 border border-sky-500/15 text-[.8rem] text-sky-500">Website und Betreuung</span>
          <div class="flex items-end gap-1 mt-3 mb-6">
            <span class="text-[38px] font-extrabold leading-none">59,50 €</span> <span class="text-slate-500 dark:text-[#b3bfd1]">/ Monat inkl. USt.</span>
          </div>
          <ul class="list-none p-0 m-0 mt-3 grid gap-2">
            <li
              v-for="feature in solohost.features.L"
              :key="feature"
              class="flex gap-2 items-start"
            >
              <span class="w-[18px] h-[18px] rounded-[6px] bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center mt-[2px] text-[13px] shrink-0">✓</span> {{ feature }}
            </li>
          </ul>
        </div>
        <div class="md:col-span-2 border rounded-[16px] p-[22px] bg-white border-black/10 dark:bg-[#0f162e] dark:border-white/10">
          <div class="flex items-end gap-1 mt-3 mb-6">
            <span class="text-[38px] font-extrabold leading-none">Erster Schritt: Erzählen Sie von sich</span>
          </div>
          <p class="text-slate-600 dark:text-[#b3bfd1] mb-3">
            In welcher Branche arbeiten Sie? Wer ist Ihre Zielgruppe und was bieten Sie an? Was macht Sie besonders?
            Erzählen Sie in Stichpunkten oder ganz natürlich per Sprachaufnahme von Ihrem Unternehmen.
            Ich bekomme dadurch einen ersten Eindruck und Ihre Website wird gleich mit passenden Inhalten gefüllt.
          </p>
          <textarea
            v-model="companyContext"
            class="w-full resize-none h-[200px] ring-gray-200 dark:ring-gray-800 ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:ring-3 outline-0 rounded-[12px] p-4 bg-gray-100 dark:bg-[#0b1020] text-slate-900 dark:text-[#e7ecf4] transition-all"
          />
          <div class="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <ClientOnly>
              <LandingpageRecordAudio
                v-model:is-running="isRecordingAudio"
                @transcript="(text: string) => companyContext = (companyContext || '') + text"
              />
            </ClientOnly>
            <a
              v-if="!isRecordingAudio"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] font-semibold tracking-[.2px] bg-sky-500/80 hover:bg-sky-500 text-white transition duration-200"
              :href="user ? `https://${user.userName}.${appHost}` : `/register?context=${encodeURIComponent(companyContext)}`"
            >
              Kostenlos registrieren
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
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-6 font-bold">
        Was Sie schon tun können
      </h2>
      <p class="my-4 text-slate-600 dark:text-[#b3bfd1]">
        Wenn Sie gerne möglichst viel selbst in die Hand nehmen wollen, aber gar nicht wissen, wo Sie anfangen sollen, helfen Ihnen vielleicht die folgenden Tipps weiter.
        Vieles können Sie auch ohne große Vorkenntnisse und ohne Geld auszugeben umsetzen. Wenn Sie Fragen haben oder bei dem ein oder anderen Punkt Unterstützung brauchen, melden Sie sich gerne bei mir.
      </p>
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
          </div>
        </template>
        <template #slot2>
          <div class="p-4">
            Werden Sie auf Google gefunden. Das ist kostenlos und mindestens genauso wichtig, wie eine eigene Website.
            Legen Sie sich ein <a
              class="text-sky-500"
              href="https://accounts.google.com/signup"
              target="_blank"
            >Google-Konto</a> an (falls Sie noch keins haben) und schauen Sie sich eine der zahlreichen <a
              class="text-sky-500"
              href="https://www.youtube.com/results?search_query=google+unternehmensprofil+erstellen"
              target="_blank"
            >Anleitungen auf YouTube</a> an oder <a class="text-sky-500" href="https://business.google.com/de/business-profile/" target="_blank">legen Sie einfach direkt los</a>. Vielleicht kommt noch ein Freischaltcode per Post, den Sie bei Google eingeben müssen. Das Wichtigste ist damit aber erstmal geschafft.
            Nicht nur Adresse und Kontaktdaten können Sie in Ihrem Unternehmensprofil hinterlegen, sondern auch Öffnungszeiten, Dienstleistungen und Produkte, Fotos und einiges mehr.
          </div>
        </template>
        <template #slot3>
          <div class="p-4">
            Kleinanzeigen.de, nebenan.de, Instagram, Facebook oder TikTok – Es gibt viele kostenlose Plattformen, auf denen Sie aktiv werben und Kunden gewinnen können.
            Nutzen Sie diese Kanäle, um sich zu zeigen und mit Ihrer Zielgruppe in Kontakt zu treten.
            Smartphones machen heutzutage gute Fotos und können diese auch gleich bearbeiten und optimieren.
            Es spricht auch nichts gegen ein Video, wenn Sie sich damit wohlfühlen. Zeigen Sie sich und Ihre Arbeit!
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
        <template #slot6>
          <div class="p-4">
            Haben Sie schon eine Lösung für Ihre Buchhaltung? Rechnungen schreiben, Belege erfassen, Umsatzsteuervoranmeldung an das Finanzamt übermitteln? Das geht mit Lexware Office ganz einfach.
            Mit dem <strong>Geschäftskonto von Lexware</strong> erhalten Sie zudem eine Visa Business Kreditkarte und Ihre Umsätze werden automatisch in der Buchhaltung erfasst.
            Ich nutze Lexware Office selbst und bin sehr zufrieden. Bei der Einrichtung helfe ich Ihnen gerne.
          </div>
          <div class="flex flex-col sm:flex-row items-center justify-end p-4 pt-0">
            <a
              :href="lexwareLink"
              target="_blank"
              class="flex flex-col gap-4"
            >
              <img src="/lexware-logo.png" alt="Lexware Office" class="inline-block shrink-0 h-22" />
            </a>
            <UButton
              :to="lexwareLink"
              target="_blank"
              label="Mehr erfahren"
              color="error"
              trailing-icon="i-heroicons-arrow-top-right-on-square"
            />
          </div>
        </template>
      </UAccordion>
    </section>

    <section class="mx-auto w-[92vw] max-w-[1200px] py-16">
      <h2 class="text-[clamp(22px,3vw,34px)] leading-[1.2] mb-6 font-bold">
        Über mich
      </h2>
      <p class="my-4 text-slate-600 dark:text-[#b3bfd1]">
        Ich habe es mir zur Aufgabe gemacht, Solo-Selbstständigen den Einstieg in die digitale Welt zu erleichtern.
        Mit langjähriger Erfahrung in IT, Webentwicklung und digitalem Marketing weiß ich, worauf es ankommt und worauf nicht.
        Mein Ziel ist es, Ihnen eine unkomplizierte und kostengünstige Lösung zu bieten, damit Sie sich auf Ihr Geschäft konzentrieren können.
      </p>
      <p class="my-4 text-slate-600 dark:text-[#b3bfd1]">
        Als Solo-Selbstständiger kenne ich die Herausforderungen und Chancen, die dieser Weg mit sich bringt.
        Daher lege ich großen Wert auf persönliche Betreuung und maßgeschneiderte Lösungen, die wirklich zu Ihnen passen.
        Ich freue mich darauf, Sie auf Ihrem Weg in die Selbstständigkeit zu begleiten.
      </p>
    </section>

    <PagesLandingpageFooter />
  </PagesLandingpageColorMode>
</template>
