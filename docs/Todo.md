# Beta Release

- Anmeldung und Registrierung richtig durchtesten.
- Profilansicht nach Aktualisierung von Einstellungen live updaten (erfordert aktuell refresh).
- Feedback Funktion implementieren (evtl. nur als Hinweis: Feddback bitte an kontakt@...)
- API Endpoints Origin schützen (nur von erlaubten Userdomains/Subdomains).
- Premium-Features richtig implementieren (es wird aktuell geprüft ob man eingeloggt ist und Premium hat und nicht ob das aufgerufene Profil Premium ist).
- Icons in IconPicker (externe Links, etc.) ergänzen
- HTML für v-html desinfizieren
- Fullscreen Gallery optimieren (Pfeile, Punkte, Mobil)
- Validierungshinweise in Anfrageformular verbessern.
- dezentere Toasts
- Settings Modal optimieren (Gallery, etc.)
- Benutzername Eingabe beim Registrieren/Anmelden validieren
- E-Mail-Templates (html emails) und Text über Anfrageformular
- Einstellungen: JSON aufräumen/strukturieren
- Headergestaltung optimieren mit Bild (Overlay, Schriftgröße, Varianten).
- Einstellung: per Du oder per Sie (in Textvorlagen, etc.)
- FAQ-Embeddings nur für Premium-Nutzer

## Datenbank und Typen

Sicherstellen, dass das Datenbank-Schema, die Typen und die Formular-Validierungen korrekt sind.
Transaktionen und Konsistenz gewährleisten.
IDs auf UUIDs umstellen.  
Foreign Keys und Constraints setzen.

## Fehlerbehandlung

Sicherstellen, welche Fehler an das Frontend weitergeleitet werden.

# Speicher

Sicherstellen, dass Dateien optimiert sind und nicht zu groß werden.  
Gegebenenfalls Beschränkungen hinsichtlich Anzahl und Kapazität in Betracht ziehen.

## Authentifizierung

Sicherstellen, dass Authentifizierung und Autorisierung für alle Datensätze korrekt implementiert sind.
Plus-Features im Backend absichern.

## Sicherheit

Implementieren von HTML-Sanitization für v-html Direktiven um XSS-Angriffe zu verhindern.  
Besonders wichtig für Email-Inhalte, die in v-html gerendert werden.

## Datenschutz

Mich als Datenschutzbeauftragten bei der zuständigen Datenschutzbehörde anmelden.  
Domains: Handles, E-Mails an Hetzner.

## Qualitätssicherung (QA)

Auflistung aller Features nach Priorität sortieren.  
Einen Testplan erstellen.  
Ein eigenes Postfach für den Domain-Robot einrichten (domains@gewerbeprofil.de).  
Alle Inhalte von markus-kottlaender.de auf gewerbeprofil.de umstellen.

## DDOS Protection

Cloudflare? Fail2ban?

## Künstliche Intelligenz (KI)

OpenAI über Azure in Deutschland/Europa hosten.

# Job Runner

Eine Datenbanktabelle mit Jobs erstellen, die von jeder App ausgewählt und ausgeführt werden können (thread-safe).

# Service Worker / PWA

Für Push-Benachrichtigungen und Offline-Funktionalität einen Service Worker implementieren.