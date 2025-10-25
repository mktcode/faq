import z from "zod"

const bodySchema = z.object({
  prompt: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
  responseId: z.string().optional(),
})

const outputSchema = z.object({
  plan: z.string().min(1, 'Die Ausgabe darf nicht leer sein.'),
});

export type WebsitePlanResponse = z.infer<typeof outputSchema>;

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { prompt, responseId } = await readValidatedBody(event, body => bodySchema.parse(body))

  const instructions = `Erarbeite im Gespräch mit dem Kunden einen Projektplan für eine Website.

Die Website kann aus mehreren Seiten/Unterseiten bestehen und jede Seite kann mehrere Sektionen/Abschnitte haben.
Die technische Umsetzung spielt an dieser Stelle keine Rolle. Gehe nicht auf Frameworks, CMS, Domain und E-Mail, SEO oder Ähnliches ein.
Es geht rein um die inhaltliche und strukturelle Planung der Website zusammen mit dem Kunden.

Liste die wichtigsten Stammdaten des Kunden auf, wie z.B. Name, Branche, Standort, USP, etc.
Beschreibe kurz den Zweck der Website und die Zielgruppe.
Liste alle Seiten auf, die die Website haben soll, und beschreibe kurz den Inhalt jeder Seite. (Impressum und Datenschutz müssen immer enthalten sein. AGB nur auf Anfrage.)
Liste für jede Seite die Sektionen auf, die sie enthalten soll, und beschreibe kurz den Inhalt jeder Sektion.

Bevorzuge eine einfache Struktur mit wenigen Seiten und Sektionen, um die Website übersichtlich und benutzerfreundlich zu gestalten.
Gut funktionierende Landingpages mit nur einer Seite sind oft effektiver als umfangreiche Websites mit vielen Unterseiten.

Beschreibe das gewünschte Design und Layout der Website, einschließlich Farbschema, Schriftarten und Stil.
Liste alle speziellen Funktionen oder Interaktionen auf, die die Website haben soll (z.B. Kontaktformulare, Animationen, Galerien).

Der Plan muss strikt der folgenden Gliederung folgen und in Markdown ausgegeben werden:

# Stammdaten

| Name        | Wert                      |
|-------------|--------------------------|
| Kunde       | [Name des Kunden]        |
| Branche     | [Branche des Kunden]     |
| Standort    | [Standort des Kunden]    |
| USP         | [Unique Selling Point]   |
| Zielgruppe  | [Zielgruppe der Website] |
| ...         | ...                      |

# Ziel der Website

Ziel der Website ist es...

# Seitenstruktur

## Startseite

[Kurze Beschreibung der Startseite]

| Sektionen | Beschreibung                      |
|-----------|-----------------------------------|
| Heldenbereich | [Beschreibung des Heldenbereichs] |
| Über uns     | [Beschreibung der Über uns Sektion] |
| Dienstleistungen | [Beschreibung der Dienstleistungen Sektion] |
| ...         | ...                               |

## ...

[Kurze Beschreibung der ... Seite]

| Sektionen | Beschreibung                      |
|-----------|-----------------------------------|
| ...       | ...                               |

# Design-Richtlinien

[Beschreibung des Designs, Farbschema, Schriftarten, Stil, etc.]

# Funktionalitäten

[Beschreibung der gewünschten Funktionalitäten]

Antworte nur mit dem fertigen Plan in Markdown. Gehe nicht auf die Anweisungen ein und stelle keine Rückfragen.
Der Plan ist ein Vorschlag und wird vom Kunden weiter angepasst.
  `

  const response = await websiteUtils.getOpenAIResponse(instructions, [
    {
      role: 'user',
      content: prompt,
    }
  ], outputSchema)

  const db = await getDatabaseConnection()
  await db.insertInto('websites')
    .values({
      userId: $profile.id,
      plan: response.output.plan,
    })
    .execute()

  return response
})