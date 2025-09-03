import type OpenAI from 'openai'

export async function readResponseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  handler: (event: OpenAI.Responses.ResponseStreamEvent) => void,
  callback?: () => void,
) {
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Nur komplette Zeilen verarbeiten, Rest aufheben
      const lastNL = buffer.lastIndexOf('\n')
      if (lastNL >= 0) {
        const block = buffer.slice(0, lastNL)
        buffer = buffer.slice(lastNL + 1)

        for (const line of block.split('\n')) {
          const s = line.replace(/\r$/, '').trim()
          if (!s) continue
          try {
            handler(JSON.parse(s))
          }
          catch (e) {
            // defensiv: falls doch unvollständig -> wieder in den Buffer
            buffer = s + '\n' + buffer
            break
          }
        }
      }
    }

    // Decoder final flush
    buffer += decoder.decode()
    const rest = buffer.trim()
    if (rest) handler(JSON.parse(rest))
  }
  finally {
    try { reader.releaseLock?.() }
    catch {}
    callback?.()
  }
}
