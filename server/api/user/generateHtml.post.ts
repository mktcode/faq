import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"
import z from "zod"

const bodySchema = z.object({
  prompt: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
  html: z.string().min(1, 'HTML darf nicht leer sein.'),
  css: z.string(),
  responseId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { prompt, html, css, responseId } = await readValidatedBody(event, body => bodySchema.parse(body))
  const settings = await getPublicSettings(user.id)

  const { openaiApiKey } = useRuntimeConfig()
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  const outputSchema = z.object({
    html: z.string(),
    css: z.string(),
    notes: z.string().optional().nullable(),
  });

  const response = await openai.responses.parse({
    previous_response_id: responseId,
    model: 'gpt-5',
    instructions: `Generiere HTML und CSS Code für eine Website-Sektion basierend auf der Anweisung des Benutzers. Du bekommst die globalen Website-Einstellungen als Orientierung. Die Anweisungen kommen von einem technisch wenig versierten Nutzer. Denke also genau darüber nach, was der Nutzer möchte.
Wenn der Nutzer nach Funktionen fragt, die nicht mit HTML/CSS umgesetzt werden können, erkläre ihm dies kurz im Notizfeld. Ansonsten nutzt du das Notizfeld nur um Rückfragen zu stellen, wenn die Anweisung des Nutzer unklar ist. Deine Aktionen brauchst du nicht erklären.
Buttons und Links dürfen nur auf externe Links verweisen oder die Seitenpfade und Sprungmarken verwenden, die sich aus den globalen Website-Einstellungen ergeben. Um direkt zu einer Sektion zu springen, verwende das Format <page-path>#<component-key>-<component-id>, als z.B. /#faq-1234 für eine FAQ-Komponente auf der Startseite.
Das CSS und etwaige CSS-Variablen werden später immer vom ID-Selektor der Sektion umschlossen, also z.B. #faq-1234 { ... }. Verwende daher selbst keine ID-Selektoren im CSS und nutze kein :root-Pseudoelement. Variablen kannst du sofort definieren und verwenden.
Achte darauf, dass der HTML- und CSS-Code valide ist und keine Fehler enthält.
Wird fehlerhafter HTML- oder CSS-Code vom Nutzer angeliefert, behebe diesen entsprechend der obigen Anweisungen.
Eigene <script> oder <style> Tags im HTML sind nicht erlaubt.
Antworte nur in dem vorgegebenen Format, bestehend aus den Feldern html, css und optional notes.`,
    input: [
      {
        role: 'developer',
        content: `<global_website_settings>
  ${JSON.stringify(settings, null, 2)}
</global_website_settings>`
      },
      {
        role: 'user',
        content: `<current_html>
  ${html}
</current_html>

<current_css>
  ${css}
</current_css>

${prompt}`,
      }
    ],
    reasoning: {
      effort: 'medium',
    },
    text: {
      format: zodTextFormat(outputSchema, "event"),
    },
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
