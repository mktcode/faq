<script setup lang="ts">
const { clear } = useUserSession()
const { me, refreshMe } = useMe()

function signOut() {
  clear()
  refreshMe()
}
</script>

<template>
  <div class="font-sans flex flex-col items-center justify-center max-w-2xl mx-auto py-12 px-4">
    <h2 class="text-2xl">
      Gerade Selbstständig gemacht?
    </h2>
    <h1 class="text-4xl font-bold mt-2">
      Brauchen Sie eine Website?
    </h1>
    <h2 class="text-2xl mt-8">
      Nein. Erstmal nicht.
    </h2>
    <div class="mt-4 flex gap-2">
      <template
        v-if="me"
      >
        <UButton
          :to="`/ask/${me.userName}`"
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
          variant="soft"
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
    <section class="prose max-w-3xl mt-12">
      <h3>
        Starten Sie sinnvoll. Nicht überstürzt.
      </h3>
      <p>
        Viele fühlen sich verpflichtet, sofort „irgendwas“ online zu bringen.
        Hauptsache, man hat eine Website. Gehört ja heute dazu.
        Bevor Sie aber viel Geld für eine Website ausgeben oder sich mühsam selbst etwas bei den zahlreichen Website-Baukästen
        zusammenklicken (was dann auch so aussieht), ist es ratsam, sich erstmal davon zu lösen und sich rein auf Ihre Inhalte zu konzentrieren.
      </p>

      <p>
        <strong>Eine Website, die niemand besucht, ist nutzlos. Eine Website, die unübersichtlich, optisch anstrengend und technisch fehlerhaft ist, ist kontravproduktiv.</strong>
        Ja, eine Website kann Ihrem Unternehmen helfen, aber machen Sie nicht den zweiten Schritt vor dem ersten.
        Stellen Sie sich zunächst erst mal folgende Fragen:
      </p>

      <ul>
        <li>Ist Ihr Google Unternehmensprofil optimiert und gut bewertet?</li>
        <li>Nutzen Sie Instagram, Facebook, Kleinanzeigen und Co. optimal?</li>
        <li>Ist Ihr Angebot klar und verständlich formuliert?</li>
        <li>Haben Sie auf alle Fragen eine Antwort parat?</li>
      </ul>

      <h3>
        Ihr kostenloses Gewerbeprofil
      </h3>

      <p>
        Auf dem Weg zur eigenen Website bieten wir Ihnen einen sinnvollen und unkomplizierten Zwischenschritt, bei dem Sie auch erst mal eine Weile stehen bleiben können.
        Wenn später dann eine vollwertige Website mit eigenem Design und allem drum und dran entstehen soll, dann sind Sie bereits bestens vorbereitet.
      </p>

      <p>
        Ihr Gewerbeprofil ist wie ein Social-Media-Profil, nur unabhängiger und ohne die Ablenkung.
        Wie eine Website, dient es als zentraler Anlaufpunkt für Ihre Kunden und Interessenten und fokussiert sich dabei auf die Aufbereitung Ihrer Inhalte und das Beantworten von Anfragen mit Hilfe unseres smarten Anfrageformulars.
      </p>

      <h3>
        Beantworten Sie keine Frage zweimal
      </h3>

      <p>
        Das Anfrageformular und die häufig gestellten Fragen (FAQ) arbeiten in Ihrem Gewerbeprofil Hand in Hand.
        Fangen Sie mit nur wenigen Fragen an, die Sie häufig gestellt bekommen.
        Beim Ausfüllen des Anfrageformulars werden Besuchern relevante Antworten direkt angezeigt.
      </p>

      <p>
        Dadurch bekommen Sie präzisere Anfragen, die Sie direkt in Ihrem Gewerbeprofil beantworten können.
        Und jedes mal, wenn Sie eine Anfrage beantworten, persönlich und in natürlicher Sprache, wird Ihr FAQ vollautomatisch überarbeitet und ergänzt, sodass der nächste Besucher direkt relevantere Informationen erhält.
      </p>

      <h3>
        Was ist mit Domain und E-Mail?
      </h3>

      <p>
        Ihr Gewerbeprofil ist unter ihrname.gewerbeprofil.de erreichbar.
        Für den Anfang reicht das. Sie können aber auch jederzeit eine eigene Domain registrieren (direkt in der App oder über einen anderen Anbieter) und Ihr Gewerbeprofil darunter betreiben.
      </p>

      <p>
        Eine E-Mail-Adresse ist nicht zwingend erforderlich. Sie erhalten alle Anfragen direkt in der App und können diese dort beantworten.
        Auf dem Smartphone können Sie Benachrichtigungen aktivieren, sodass Sie schnell auf neue Anfragen reagieren können.
        Haben Sie bereits eine E-Mail-Adresse, werden Anfragen auch dorthin weitergeleitet und Sie können aus Ihrem E-Mail-Postfach heraus antworten.
      </p>

      <p>
        Domains sowie E-Mail-Postfächer kosten bei uns jeweils 1 Euro pro Monat.
      </p>
    </section>
  </div>
</template>
