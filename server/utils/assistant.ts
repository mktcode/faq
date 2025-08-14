import { OpenAI } from 'openai'

export async function updateCompanyContext(openai: OpenAI, userId: number, updates: string) {
  const db = await getDatabaseConnection()

  const settings = await getSettings(userId)

  const response = await openai.responses.create({
    model: 'gpt-5-nano',
    instructions: `Integrate the provided update into the latest version of the company context. Return only the fully updated and complete company context. Exclude any comments, introductions, or headings—output strictly the revised company context for straightforward copy-paste.`,
    input: [
      {
        role: 'developer',
        content: settings.private.assistant.context || 'No existing context available. Please start with a clean slate.'
      },
      {
        role: 'user',
        content: updates
      }
    ],
  })

  settings.private.assistant.context = response.output_text

  await db
    .updateTable('users')
    .set({
      'settings': JSON.stringify(settings)
    })
    .where('id', '=', userId)
    .execute()
  
  return { success: true }
}
