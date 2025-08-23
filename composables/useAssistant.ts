import type { ResponseStreamEvent } from "openai/resources/responses/responses.mjs"

export const useAssistant = () => {
  const isGeneratingResponse = ref(false)
  const currentActivity = ref<{ label: string, details?: string } | null>(null)
  const messages = ref<{ role: 'user' | 'assistant', content: string }[]>([])
  const nextMessageIndex = ref<number | null>(null)
  const error = ref<string | null>(null)

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
    catch (error) {
      console.error('Error generating response:', error)
    }
    finally {
      isGeneratingResponse.value = false
      currentActivity.value = null
    }
  }

  return {
    isGeneratingResponse,
    currentActivity,
    messages,
    nextMessageIndex,
    error,
    generateResponse,
  }
}