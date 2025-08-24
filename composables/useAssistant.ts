import type { ResponseStreamEvent } from "openai/resources/responses/responses.mjs"

export const useAssistant = () => {
  const isGeneratingResponse = ref(false)
  const currentActivity = ref<{ label: string, details?: string } | null>(null)
  const messages = ref<{ role: 'user' | 'assistant', content: string }[]>([])
  const nextMessageIndex = ref<number | null>(null)
  const error = ref<string | null>(null)
  const previousResponseId = ref<string | null>(null)

  async function generateResponse(
    endpoint: string,
    body: Record<string, any>,
    eventHandler: (event: ResponseStreamEvent) => void,
  ) {
    if (isGeneratingResponse.value) return
    isGeneratingResponse.value = true

    try {
      const responseStream = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!responseStream.body) {
        throw new Error(responseStream.statusText)
      }

      const responseStreamReader = responseStream.body.getReader()

      await readResponseStream(responseStreamReader, eventHandler, () => {
        isGeneratingResponse.value = false
      })
    }
    catch (e) {
      error.value = 'Ein unbekannter Fehler ist aufgetreten. Versuchen Sie es bitte später erneut oder kontaktieren Sie den Support.'
    }
    finally {
      isGeneratingResponse.value = false
      currentActivity.value = null
    }
  }

  function parseActivity(event: ResponseStreamEvent) {
    if (event.type === 'response.output_item.added') {
      const itemType = event.item.type

      if (itemType === 'reasoning') currentActivity.value = { label: 'Denke nach...' }
      if (itemType === 'web_search_call') currentActivity.value = { label: 'Suche im Internet...' }
      if (itemType === 'image_generation_call') currentActivity.value = { label: 'Generiere Bild...' }
      if (itemType === 'function_call') {
        const itemName = event.item.name

        if (itemName === 'delegate_to_agent') currentActivity.value = { label: 'Delegiere an Agenten...' }
      }
      if (itemType === 'message') {
        currentActivity.value = null
      }
    }
  }

  function parseError(event: ResponseStreamEvent) {
    if (event.type === 'error') {
      error.value = event.message || 'Unbekannter Fehler'
    }
  }

  function parseResponseId(event: ResponseStreamEvent) {
    if (event.type === 'response.created') {
      previousResponseId.value = event.response.id
    }
  }

  function parseNextMessageId(event: ResponseStreamEvent) {
    if (event.type === 'response.output_item.added' && event.item.type === 'message') {
      messages.value.push({ role: 'assistant', content: '' })
      nextMessageIndex.value = messages.value.length - 1
    }
  }

  function parseMessageDelta(event: ResponseStreamEvent) {
    if (event.type === 'response.output_text.delta') {
      if (!nextMessageIndex.value) {
        throw new Error('No next message index found. Event order may be incorrect.')
      }

      messages.value[nextMessageIndex.value].content += event.delta
    }
  }

  return {
    isGeneratingResponse,
    currentActivity,
    messages,
    nextMessageIndex,
    error,
    previousResponseId,
    parseActivity,
    parseError,
    parseResponseId,
    parseNextMessageId,
    parseMessageDelta,
    generateResponse,
  }
}