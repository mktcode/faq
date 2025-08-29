export type WootConversation = {
  id: number
  status: string
  inbox_id: number
  messages: WootMessage[]
}

export type WootMessage = {
  id: number
  content: string
  account_id: number
  inbox_id: number
  conversation_id: number
  message_type: number
  created_at: number
  updated_at: number
  private: boolean
  status: string
  source_id: string
  content_type: string
  content_attributes: Record<string, any>
  sender_type: string
  sender_id: number
  external_source_ids: Record<string, any>
  additional_attributes: Record<string, any>
  processed_message_content: string
  sentiment: Record<string, any>
  conversation: Record<string, any>
  attachment: Record<string, any>
  sender: Record<string, any>
}

export type WootContactCreated = {
  id: number
  source_id: string
  name: string
  email: string
  pubsub_token: string
}