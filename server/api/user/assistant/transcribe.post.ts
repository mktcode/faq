import fs from 'node:fs'
import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
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
  const audioFilename = `/tmp/transcription-solohost-assistant-${randomHash}.ogg`

  const data = audioChunks[0]?.data

  if (!data) {
    fs.unlinkSync(audioFilename)
    return {
      statusCode: 400,
      body: 'No audio file provided',
    }
  }

  fs.writeFileSync(audioFilename, new Uint8Array(data))

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilename),
    language: 'de',
    model: 'whisper-1',
    response_format: 'text',
  })

  fs.unlinkSync(audioFilename)

  return transcription
})
