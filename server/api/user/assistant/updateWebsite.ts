import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"
import z from "zod"

const bodySchema = z.object({
  prompt: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
  images: z.array(z.string().min(1, 'Bild-URL darf nicht leer sein.')),
  html: z.string().min(1, 'HTML darf nicht leer sein.'),
  css: z.string(),
  js: z.string(),
  responseId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const $profile = await requireProfileWithPermission(event)
  const { prompt, html, css, js, responseId, images } = await readValidatedBody(event, body => bodySchema.parse(body))

  const { openaiApiKey } = useRuntimeConfig()
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  const outputSchema = z.object({
    html: z.string().optional().nullable(),
    css: z.string().optional().nullable(),
    js: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  });

  const instructions = `Generiere HTML, CSS und JS Code für eine Website-Sektion basierend auf der Anweisung des Benutzers.

Du bekommst die globalen Website-Einstellungen als Orientierung. Die Anweisungen kommen von einem technisch wenig versierten Nutzer. Denke also genau darüber nach, was der Nutzer möchte.

Es gibt kein Backend, also keine Datenbank oder API. Die Website dient nur zur Darstellung von Informationen im Browser.
Wenn der Nutzer nach Funktionen fragt, die nicht mit HTML, CSS und JS umsetzbar sind, erkläre dies kurz im Notizfeld. Ansonsten nutze das Notizfeld nur um Rückfragen zu stellen, wenn die Anweisung des Nutzers unklar ist. Deine Vorgehensweise bei der Umsetzung brauchst du nicht zu erläutern.

Buttons und Links dürfen nur auf externe Links verweisen (target="_blank") oder die Seitenpfade und Sprungmarken verwenden, die sich aus den globalen Website-Einstellungen ergeben. Um direkt zu einer Sektion zu springen, verwende das Format <page-path>#<section-slug>, als z.B. /#ueber-uns für eine "Über Uns"-Sektion auf der Startseite.
Du kannst die Bild-URLs verwenden, die der Nutzer in seiner Anweisung mitgeschickt hat. Alternativ kannst du auch Platzhalter-Bilder wie z.B. https://picsum.photos/id/123/800/600 verwenden. (Die ID muss zwischen 1 und 1000 liegen. Die letzten beiden Zahlen sind Breite und Höhe.)

Das CSS und etwaige CSS-Variablen werden später immer vom ID-Selektor der Sektion umschlossen, also z.B. #ueber-uns { h1 { ... } }. Verwende daher selbst keine ID-Selektoren im CSS und nutze kein :root-Pseudoelement. Variablen kannst du sofort definieren und verwenden. Globale CSS-Variablen sind den Website-Einstellungen zu entnehmen.
Das Javascript wird im <head> der Seite eingebunden und automatisch von einem DOMContentLoaded-Event-Listener umschlossen. Du brauchst also keinen eigenen Event-Listener dafür schreiben.
Alpine.js ist global verfügbar. Du kannst also direkt Alpine-Attribute (x-data, x-bind, x-on, x-show, x-if, x-for, etc.) Alpine-Properties ($store, $el, $refs, $dispatch, etc.) und Alpine-Methoden (Alpine.store und Alpine.data) verwenden. Mache davon aber nur Gebrauch, wenn es wirklich nötig ist. Kleinere Interaktionen sollten mit reinem Javascript umgesetzt werden.

Achte darauf, dass der HTML-, CSS- und JS-Code valide ist und keine Fehler enthält.
Wird fehlerhafter Code angeliefert, behebe diesen entsprechend der obigen Anweisungen.

Antworte nur in dem vorgegebenen Format, bestehend aus den Feldern html, css, js und notes.
Alle Felder sind optional, aber mindestens eines muss befüllt sein. Wenn Änderungen z.B. nur im HTML notwendig sind, liefere nur das html-Feld zurück.

Achte bei jeder Änderung aber darauf, dass der gesamte HTML, CSS oder JS Code dieser Sektion jeweils erhalten bleibt.
Vorhandener Code wird komplett durch deinen neuen Code ersetzt.
Auslassungen und Platzhalter sind daher nicht erlaubt, außer es wird explizit vom Nutzer so gewünscht.`

  const response = await openai.responses.parse({
    previous_response_id: responseId,
    model: 'gpt-5',
    reasoning: {
      effort: 'medium',
    },
    text: {
      format: zodTextFormat(outputSchema, "event"),
    },
    instructions,
    input: [
      {
        role: 'user',
        content: `<global_website_settings>
${JSON.stringify({
  meta: $profile.settings.public.meta,
  company: $profile.settings.public.company,
  design: $profile.settings.public.design,
  pages: $profile.settings.public.pages.map(page => ({
    path: page.path,
    title: page.title,
    description: page.description,
    sections: page.components.map(component => ({
      title: component.title,
      description: component.description,
    })),
  })),
}, null, 2)}
</global_website_settings>

<attached_images>
${images.join('\n')}
</attached_images>

<current_html>
${html}
</current_html>

<current_css>
${css}
</current_css>

<current_js>
${js}
</current_js>

${prompt}`,
      }
    ],
  })

  if (!response.output_parsed) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Die KI konnte die Anweisung nicht verarbeiten. Bitte versuchen Sie es erneut.',
    })
  }

  return {
    responseId: response.id,
    ...response.output_parsed,
  }
})
