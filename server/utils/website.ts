import { z } from "zod"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"

async function getOpenAIResponse<TOutputSchema extends z.ZodTypeAny>(
  instructions: string,
  input: OpenAI.Responses.ResponseInput,
  outputSchema: TOutputSchema,
): Promise<{ responseId: string, output: z.output<TOutputSchema> }> {
  const { openaiApiKey } = useRuntimeConfig()
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  console.time("OpenAI Response Time")
  const response = await openai.responses.parse({
    model: 'gpt-5-mini',
    reasoning: {
      effort: 'medium',
    },
    text: {
      format: zodTextFormat(outputSchema, "event"),
    },
    instructions,
    input,
  })
  console.timeEnd("OpenAI Response Time")

  if (!response.output_parsed) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Die KI konnte die Anweisung nicht verarbeiten. Bitte versuchen Sie es erneut.',
    })
  }

  const parsedOutput = outputSchema.parse(response.output_parsed)

  return {
    responseId: response.id,
    output: parsedOutput,
  }
}

export const websiteUtils = {
  getOpenAIResponse,
}