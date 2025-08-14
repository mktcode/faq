import OpenAI from 'openai'
import { getSettings } from '~/server/utils/user'
import { getInstructions, updateCompanyContext } from '~/server/utils/assistant'
import z from 'zod'

const bodySchema = z.object({
  userInput: z.string().min(1, 'Die Eingabe darf nicht leer sein.'),
  responseId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  await requireProfileSubscription(user.userName)

  const settings = await getSettings(user.id)
  const { userInput, responseId } = await readValidatedBody(event, body => bodySchema.parse(body))
  const { openaiApiKey } = useRuntimeConfig(event)
  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  const instructions = getInstructions(settings.public)
  const messages: OpenAI.Responses.ResponseInput = []

  if (!responseId && settings.private.assistant.context) {
    messages.push({
      role: 'developer',
      content: `<company_context>${settings.private.assistant.context}</company_context>`,
    })
  }

  messages.push({
    role: 'user',
    content: userInput,
  })

  const response = await openai.responses.create({
    previous_response_id: responseId,
    model: 'gpt-5-mini',
    instructions,
    input: messages,
    reasoning: {
      effort: 'medium',
    },
    text: {
      verbosity: 'low',
    },
    tools: [
      {
        type: 'web_search_preview',
        user_location: {
          type: 'approximate',
          country: 'DE',
          city: settings.public.company.city || undefined,
        },
      },
      {
        type: 'image_generation',
      },
      {
        type: 'function',
        name: 'update_company_context',
        description: 'Update the company context with new information provided by the user. Never use this tool without explicit user consent.',
        parameters: {
          type: 'object',
          properties: {
            updates: {
              type: 'string',
              description: 'A detailed description of the company context updates.',
            },
          },
          required: ['updates'],
          additionalProperties: false,
        },
        strict: true,
      },
      {
        type: 'function',
        name: 'ask_website_manual_assistant',
        description: 'Update the company context with new information provided by the user. Never use this tool without explicit user consent.',
        parameters: {
          type: 'object',
          properties: {
            request: {
              type: 'string',
              description: 'A detailed description of the questions to ask the website manual assistant.',
            },
          },
          required: ['request'],
          additionalProperties: false,
        },
        strict: true,
      },
    ],
    parallel_tool_calls: false,
  })

  const functionCall = response.output.find(item => item.type === 'function_call') as OpenAI.Responses.ResponseFunctionToolCall | undefined

  if (functionCall) {
    const functionCallArguments = JSON.parse(functionCall.arguments)

    if (functionCallArguments.updates && functionCall.name === 'update_company_context') {
      const result = await updateCompanyContext(openai, user.id, functionCallArguments.updates)

      const responseAfterToolCall = await openai.responses.create({
        previous_response_id: response.id,
        model: 'gpt-5-mini',
        instructions,
        input: [
          {
            type: 'function_call_output',
            call_id: functionCall.call_id,
            output: JSON.stringify(result),
          },
        ],
        reasoning: {
          effort: 'medium',
        },
        text: {
          verbosity: 'low',
        },
      })

      return responseAfterToolCall
    }

    if (functionCallArguments.request && functionCall.name === 'ask_website_manual_assistant') {
      const result = await askWebsiteManualAssistant(openai, functionCallArguments.request)

      const responseAfterToolCall = await openai.responses.create({
        previous_response_id: response.id,
        model: 'gpt-5-mini',
        instructions,
        input: [
          {
            type: 'function_call_output',
            call_id: functionCall.call_id,
            output: JSON.stringify(result),
          },
        ],
        reasoning: {
          effort: 'medium',
        },
        text: {
          verbosity: 'low',
        },
      })

      return responseAfterToolCall
    }
  }

  return response
})
