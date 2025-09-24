<template>
  <PagesLandingpageColorMode class="font-poppins text-[16px]/[1.6] bg-slate-50 text-slate-900 dark:bg-[#0b1020] dark:text-[#e7ecf4]">
    <PagesLandingpageHeader />

    <div class="mx-auto flex flex-col justify-center py-16 lg:py-24 !max-w-7xl px-6 lg:px-8 prose-sm prose-headings:font-bold sm:prose lg:prose-lg dark:prose-invert">
      <h1 class="!mb-1 !text-2xl">
        Datenschutzerklärung
      </h1>
      <h2 class="!text-sky-500 !mt-0">
        Gemäß DSGVO und BDSG
      </h2>

      <p>Der Schutz persönlicher Daten ist wichtig. In dieser Erklärung wird beschrieben, welche Daten erhoben werden, warum das geschieht und wie damit umgegangen wird.</p>

      <h2>1. Verantwortlich für die Datenverarbeitung</h2>
      <p><strong>Markus Kottländer</strong><br>
      Gertrudenstraße 23a<br>
      Tel.: 0176 70 86 46 27<br>
      E-Mail: <a href="mailto:kontakt@markus-kottlaender.de">kontakt@markus-kottlaender.de</a>
      </p>
      <p>An diese Kontaktdaten können jederzeit Fragen zum Datenschutz gestellt werden.</p>

      <h2>2. Hosting und technische Grundlagen</h2>
      <ul>
        <li>Die Solohost-Web-App läuft auf Servern bei <strong>Hetzner</strong> in Deutschland.</li>
        <li>Es werden keine IP-Adressen oder Browser-Infos dauerhaft protokolliert.</li>
        <li>Für hochgeladene Dateien (z. B. Bilder, PDFs) wird ein Speicherplatz bei Hetzner genutzt. Diese Dateien sind öffentlich erreichbar, wenn sie Teil einer Website sein sollen.</li>
        <li>Die Datenbank ist nur intern zugänglich, aber nicht zusätzlich verschlüsselt.</li>
      </ul>

      <h2>3. Cookies und Local Storage</h2>
      <ul>
        <li>Ein technisches Session-Cookie (gültig 7 Tage) für Login und Anmeldung.</li>
        <li>Zusätzlich wird der Local Storage im Browser genutzt, z. B. um zu speichern, ob ein Hinweisfenster bereits geschlossen wurde.</li>
        <li>Es werden keine Cookies zu Werbe- oder Tracking-Zwecken eingesetzt.</li>
      </ul>

      <h2>4. Registrierung und Login</h2>
      <ul>
        <li>Anmeldung ausschließlich mit <strong>Passkeys</strong>.</li>
        <li>Kein Passwort-basiertes Login.</li>
        <li>E-Mail-Adresse optional, nur für einmalige Codes zum Verknüpfen weiterer Geräte.</li>
      </ul>

      <h2>5. Inhalte in der Web-App</h2>
      <ul>
        <li>Bei der Registrierung können Angaben zum Unternehmen gemacht werden.</li>
        <li>Optional ist eine Audioaufnahme möglich. Diese wird über <strong>OpenAI</strong> in den USA automatisch in Text umgewandelt.</li>
      </ul>

      <h2>6. Abonnements und Bezahlung</h2>
      <ul>
        <li>Alle Zahlungen werden über <strong>Stripe</strong> abgewickelt.</li>
        <li>Die für die Abrechnung erforderlichen Daten werden an Stripe übermittelt.</li>
        <li>Vertrags- und Rechnungsdaten müssen aus steuerlichen Gründen 10 Jahre gespeichert werden.</li>
      </ul>

      <h2>7. Kommunikation und Support</h2>
      <ul>
        <li>Für den Live-Chat wird <strong>Chatwoot</strong> eingesetzt, das auf eigenen Servern läuft. Chats bleiben gespeichert, bis sie vom Kunden oder manuell gelöscht werden.</li>
        <li>Für Fernwartung wird <strong>RustDesk</strong> genutzt (eigener Server bei Hetzner). Dabei können Bildschirminhalte sichtbar sein. Es werden keine Protokolle gespeichert.</li>
        <li>E-Mails werden über <strong>mailbox.org</strong> verarbeitet.</li>
      </ul>

      <h2>8. Nutzung von künstlicher Intelligenz</h2>
      <ul>
        <li>Die Web-App nutzt <strong>OpenAI</strong> (USA), um Texte zu verarbeiten und Antworten zu erzeugen.</li>
        <li>Betroffen sein können Website-Inhalte, Support-Anfragen oder Audio-Transkripte.</li>
        <li>Derzeit läuft der Dienst in den USA, eine Bereitstellung in Europa wird angestrebt.</li>
      </ul>

      <h2>9. Buchhaltung</h2>
      <ul>
        <li>Buchhaltung über <strong>Lexware Office</strong> mit Verarbeitung in deutschen Rechenzentren.</li>
      </ul>

      <h2>10. Konto und Löschung</h2>
      <ul>
        <li>Derzeit keine Selbstbedienungsfunktion zum Löschen eines Kontos.</li>
        <li>Löschung ist jederzeit auf Anfrage möglich.</li>
        <li>Daten werden nach Anfrage gelöscht, soweit keine gesetzlichen Pflichten bestehen.</li>
      </ul>

      <h2>11. Speicherdauer</h2>
      <ul>
        <li>Session-Cookie: 7 Tage</li>
        <li>Support-Chats: bis zur Löschung durch Kunde oder manuell</li>
        <li>Vertrags- und Rechnungsdaten: 10 Jahre</li>
        <li>Backups: [noch zu ergänzen]</li>
      </ul>

      <h2>12. Sicherheit</h2>
      <ul>
        <li>Verbindung zur Web-App ist verschlüsselt (HTTPS).</li>
        <li>Datenbank ist nur intern erreichbar und durch Firewall geschützt.</li>
        <li>Dateien, die auf Kundenwebsites erscheinen, sind öffentlich abrufbar.</li>
      </ul>

      <h2>13. Rechte der Nutzerinnen und Nutzer</h2>
      <ul>
        <li>Auskunft über gespeicherte Daten</li>
        <li>Berichtigung falscher Daten</li>
        <li>Löschung oder Einschränkung der Verarbeitung</li>
        <li>Widerspruch gegen die Verarbeitung</li>
        <li>Datenübertragbarkeit</li>
        <li>Beschwerde bei einer Datenschutzbehörde</li>
      </ul>
    </div>

    <PagesLandingpageFooter />
  </PagesLandingpageColorMode>
</template>
