import { OpenAI } from 'openai'

export function createOpenAIClient() {
  const { openaiApiKey } = useRuntimeConfig()

  return new OpenAI({ apiKey: openaiApiKey })
}
