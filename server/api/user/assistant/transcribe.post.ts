import fs from 'node:fs'
import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  const audioChunks = await readMultipartFormData(event)
  const runtimeConfig = useRuntimeConfig(event)
  const openai = new OpenAI({
    apiKey: runtimeConfig.openaiApiKey,
  })

  if (!audioChunks) {
    return {
      statusCode: 400,
      body: 'No audio file provided',
    }
  }

  const randomHash = Math.random().toString(36).substring(7)
  const audioFilename = `/tmp/transcription-solihost-assistant-${randomHash}.ogg`

  fs.writeFileSync(audioFilename, new Uint8Array(audioChunks[0].data))

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilename),
    language: 'de',
    model: 'whisper-1',
    response_format: 'text',
  })

  fs.unlinkSync(audioFilename)

  return transcription
})
