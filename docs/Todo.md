# Datenbank und Typen

Sicherstellen, dass das Datenbank-Schema, die Typen und die Formular-Validierungen korrekt sind.  
Transaktionen und Konsistenz gewährleisten.  
IDs auf UUIDs umstellen.  
Foreign Keys und Constraints setzen.

# Skalierung

Datenbank aufsplitten:
- Payments
- Website, Domain, Email
- Buchhaltung

# Fehlerbehandlung

Sicherstellen, welche Fehler an das Frontend weitergeleitet werden.

# Speicher

Sicherstellen, dass Dateien optimiert sind und nicht zu groß werden.  
Gegebenenfalls Beschränkungen hinsichtlich Anzahl und Kapazität in Betracht ziehen.

# Authentifizierung

Sicherstellen, dass Authentifizierung und Autorisierung für alle Datensätze korrekt implementiert sind.

# Sicherheit

Implementieren von HTML-Sanitization für v-html Direktiven um XSS-Angriffe zu verhindern.  
Besonders wichtig für Email-Inhalte, die in v-html gerendert werden.

# Datenschutz

Mich als Datenschutzbeauftragten bei der zuständigen Datenschutzbehörde anmelden.  
Domains: Handles, E-Mails an Hetzner.

# Qualitätssicherung (QA)

Auflistung aller Features nach Priorität sortieren.  
Einen Testplan erstellen.  
Ein eigenes Postfach für den Domain-Robot einrichten (domains@solihost.de).  
Alle Inhalte von markus-kottlaender.de auf solihost.de umstellen.

## DDOS Protection

Cloudflare? Fail2ban?

# Künstliche Intelligenz (KI)

OpenAI über Azure in Deutschland/Europa hosten.

# E-Mail

Mailserver-API-Zugriff nur von App-Servern aus erlauben.

# Job Runner

Eine Datenbanktabelle mit Jobs erstellen, die von jeder App ausgewählt und ausgeführt werden können (thread-safe).

# Service Worker / PWA

Für Push-Benachrichtigungen und Offline-Funktionalität einen Service Worker implementieren.