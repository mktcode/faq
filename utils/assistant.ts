import type OpenAI from "openai"

export async function readResponseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  handler: (event: OpenAI.Responses.ResponseStreamEvent) => void,
  callback?: () => void,
) {
  const decoder = new TextDecoder('utf-8')

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      if (callback) {
        callback()
      }
      break
    }

    const rawMessagesString = decoder.decode(value)
    const messagesJsonString = `[${rawMessagesString.replace(/}\s*?{/g, '},{')}]` // Why no valid json? WHY?!
    const messages = JSON.parse(messagesJsonString)

    for (const message of messages) {
      handler(message)
    }
  }
}